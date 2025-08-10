import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { RecuperarPassword } from './dto/rescuperar-admin.dto copy';
import { ResetearPasswordDto } from './dto/reset-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto copy';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {}

  // admin.service.ts
async loginAdmin(dto: LoginAdminDto): Promise<{ access_token: string }> {
  const { cedula, password } = dto;

  const admin = await this.adminRepository.findOne({ where: { cedula } });

  if (!admin) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  const payload = { sub: admin.id, cedula: admin.cedula };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { access_token };
}


  // Método para registrar un administrador
  async registerAdmin(dto: CreateAdminDto): Promise<Admin> {
    const { cedula, password, correo } = dto;
  
    try {
      // Verificar si ya existe un administrador con la misma cédula
      const existingAdmin = await this.adminRepository.findOne({ where: { cedula } });
      if (existingAdmin) {
        throw new Error('El administrador ya existe');
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = this.adminRepository.create({
        cedula,
        correo,
        password: hashedPassword,
      });
  
      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      throw new Error(`Error al registrar el administrador: ${error.message}`);
    }
  }

  async validateAdmin(correo: string, password: string): Promise<any> {
    const admin = await this.adminRepository.findOneBy({ correo });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return result;
    }

    return null;
  }

  async contrasenaOlvidada(dto: RecuperarPassword): Promise<{ message: string }> {
    const { correo } = dto;
  
    const admin = await this.adminRepository.findOne({ where: { correo } });
  
    // Siempre responder lo mismo para evitar revelar si un usuario existe o no
    if (!admin) {
      return { message: 'Si la cedula está registrada, recibirás un mensaje con instrucciones.' };
    }
  
    try {
      // Generar token de recuperación
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  
      admin.resetToken = token;
      admin.resetTokenExpires = expires;
      await this.adminRepository.save(admin);
  
      // Construir enlace de restablecimiento
      const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}&tipo=admin`;

      
      // Configurar transporte de correo
     const transporter = nodemailer.createTransport({
           service: 'Gmail',
           auth: {
             user: process.env.EMAIL_FROM,
             pass: process.env.EMAIL_PASSWORD,
           },
         });

  
      // Enviar correo
      await transporter.sendMail({
        from: process.env.CORREO_FROM,
        to: admin.correo,
        subject: 'Restablecimiento de contraseña',
        html: `
          <p>Hola usuario,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para continuar:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        `,
      });
  
      return { message: 'Correo de recuperación enviado correctamente' };
    } catch (error) {
      console.error('Error enviando correo de recuperación:', error);
      throw new InternalServerErrorException('Ocurrió un error al procesar la solicitud.');
    }
  }

  async resetPassword(dto: ResetearPasswordDto): Promise<{ message: string }> {
  const { token, newPassword } = dto;
  console.log('Token recibido:', token);

  const admin = await this.adminRepository.findOne({ where: { resetToken: token } });
  console.log('Admin encontrado:', admin);

  if (!admin || admin.resetTokenExpires < new Date()) {
    console.log('Token inválido o expirado');
    throw new Error('El token es inválido.');
  }

  admin.password = await bcrypt.hash(newPassword, 10);
  admin.resetToken = null;
  admin.resetTokenExpires = null;

  await this.adminRepository.save(admin);

  return { message: 'La contraseña se actualizó correctamente.' };
}

  
  
  
}
