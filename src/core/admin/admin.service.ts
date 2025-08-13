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

  
// Método para iniciar sesión del administrador y devolver un token JWT
async loginAdmin(dto: LoginAdminDto): Promise<{ access_token: string }> {
  const { cedula, password } = dto;

  // Buscar administrador por cédula
  const admin = await this.adminRepository.findOne({ where: { cedula } });
  if (!admin) {
    throw new Error('Credenciales inválidas'); // No existe admin con esa cédula
  }

  // Comparar la contraseña enviada con la contraseña hasheada guardada
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas'); // Contraseña incorrecta
  }

  // Crear payload para el token con datos mínimos
  const payload = { sub: admin.id, cedula: admin.cedula };

  // Firmar y generar el token JWT con clave secreta y expiración de 1 hora
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Devolver el token para autenticación en el cliente
  return { access_token };
}

// Método para registrar un nuevo administrador
async registerAdmin(dto: CreateAdminDto): Promise<Admin> {
  const { cedula, password, correo } = dto;

  try {
    // Verificar si ya existe un admin con la misma cédula
    const existingAdmin = await this.adminRepository.findOne({ where: { cedula } });
    if (existingAdmin) {
      throw new Error('El administrador ya existe');
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear entidad admin con los datos y contraseña hasheada
    const newAdmin = this.adminRepository.create({
      cedula,
      correo,
      password: hashedPassword,
    });

    // Guardar el nuevo admin en la base de datos
    return await this.adminRepository.save(newAdmin);

  } catch (error) {
    // Capturar y lanzar error con mensaje personalizado
    throw new Error(`Error al registrar el administrador: ${error.message}`);
  }
}

// Método para validar administrador por correo y contraseña
async validateAdmin(correo: string, password: string): Promise<any> {
  const admin = await this.adminRepository.findOneBy({ correo });

  // Verificar que exista y que la contraseña sea correcta
  if (admin && await bcrypt.compare(password, admin.password)) {
    // Excluir la contraseña del resultado para no exponerla
    const { password, ...result } = admin;
    return result;
  }

  // Retornar null si no se valida
  return null;
}

// Método para procesar solicitud de contraseña olvidada
async contrasenaOlvidada(dto: RecuperarPassword): Promise<{ message: string }> {
  const { correo } = dto;

  // Buscar admin por correo
  const admin = await this.adminRepository.findOne({ where: { correo } });

  // No revelar si el correo existe o no (por seguridad)
  if (!admin) {
    return { message: 'Si la cedula está registrada, recibirás un mensaje con instrucciones.' };
  }

  try {
    // Generar token aleatorio y fecha de expiración (1 hora)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token y expiración en la entidad admin
    admin.resetToken = token;
    admin.resetTokenExpires = expires;
    await this.adminRepository.save(admin);

    // Crear enlace para restablecer contraseña (frontend)
    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}&tipo=admin`;

    // Configurar transporte para enviar correo (usando Gmail)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Enviar correo con el enlace de restablecimiento
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

// Método para restablecer la contraseña usando token recibido por correo
async resetPassword(dto: ResetearPasswordDto): Promise<{ message: string }> {
  const { token, newPassword } = dto;

  // Buscar administrador por token de restablecimiento
  const admin = await this.adminRepository.findOne({ where: { resetToken: token } });

  // Validar que el token exista y no haya expirado
  if (!admin || admin.resetTokenExpires < new Date()) {
    throw new Error('El token es inválido o ha expirado.');
  }

  // Hashear la nueva contraseña
  admin.password = await bcrypt.hash(newPassword, 10);

  // Limpiar token y fecha de expiración para evitar reuso
  admin.resetToken = null;
  admin.resetTokenExpires = null;

  // Guardar los cambios en la base de datos
  await this.adminRepository.save(admin);

  return { message: 'La contraseña se actualizó correctamente.' };
}

  
  
}
