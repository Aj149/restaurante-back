// users.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { ForgotPasswordDto } from './dto/recuperar-user.dto';
import { ResetPasswordDto } from './dto/resert-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ✅ Registro de usuario
  async register(createUserDto: CreateUserDto): Promise<any> {
    const existing = await this.userRepository.findOneBy({ email: createUserDto.email });

    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedContraseña = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedContraseña,
    });

    await this.userRepository.save(newUser);
    return { message: 'Usuario registrado correctamente' };
  }

  // ✅ Validar usuario por login
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // ✅ Login y generación de token
  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role || 'usuario' };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  // ✅ Validación del login
  async loginUser(loginDto: LoginUserDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.login(user);
  }

  async findAll(): Promise<LoginUserDto[]> {
    return this.userRepository.find();  // Consulta a la base de datos para obtener todos los usuarios
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      return { message: 'Si el correo está registrado, recibirás un mensaje con instrucciones.' };
    }
  
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
  
    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.userRepository.save(user);
  
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
  
    return { message: 'Correo de recuperación enviado correctamente' };
  }


  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = dto;
    const user = await this.userRepository.findOne({ where: { resetToken: token } });
  
    if (!user || user.resetTokenExpires < new Date()) {
      throw new Error('Token inválido o expirado');
    }
  
    user.password = await bcrypt.hash(newPassword, 10); // Encriptamos la nueva contraseña
    user.resetToken = null; // Limpiamos el token para que no se pueda usar más
    user.resetTokenExpires = null;
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada con exito' };
  }
  
  

}
