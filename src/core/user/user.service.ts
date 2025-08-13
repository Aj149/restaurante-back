// users.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { ForgotPasswordDto } from './dto/recuperar-user.dto';
import { ResetPasswordDto } from './dto/resert-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  
  // Método para registrar un nuevo usuario
async register(createUserDto: CreateUserDto): Promise<any> {
  // Verificar si ya existe un usuario con el mismo email
  const existing = await this.userRepository.findOneBy({ email: createUserDto.email });

  if (existing) {
    // Si existe, lanzar error de validación
    throw new BadRequestException('El email ya está registrado');
  }

  // Hashear la contraseña para seguridad antes de guardar en BD
  const hashedContraseña = await bcrypt.hash(createUserDto.password, 10);

  // Crear la entidad usuario con los datos recibidos y la contraseña hasheada
  const newUser = this.userRepository.create({
    ...createUserDto,
    password: hashedContraseña,
  });

  // Guardar el nuevo usuario en la base de datos
  await this.userRepository.save(newUser);

  // Retornar mensaje de éxito
  return { message: 'Usuario registrado correctamente' };
}

// Método para validar usuario al iniciar sesión
async validateUser(email: string, password: string): Promise<any> {
  // Buscar usuario por email
  const user = await this.userRepository.findOneBy({ email });

  // Verificar que exista y que la contraseña coincida con la hasheada
  if (user && await bcrypt.compare(password, user.password)) {
    // Excluir la contraseña de la respuesta para no exponerla
    const { password, ...result } = user;
    return result; // Retornar datos del usuario sin la contraseña
  }

  // Retornar null si no se validó correctamente
  return null;
}


 // Método que genera el token JWT con la información del usuario
async login(user: any) {
  // Crear el payload con los datos que quieres incluir en el token
  const payload = {
    sub: user.id,               // Identificador único del usuario
    email: user.email,          // Email del usuario
    nombre: user.nombre,        // Nombre para incluir en el token
    apellido: user.apellido,    // Apellido del usuario
    telefono: user.telefono,    // Teléfono del usuario
    direccion: user.direccion,  // Dirección del usuario
    role: user.role || 'usuario' // Rol, por defecto 'usuario' si no tiene rol asignado
  };

  // Firmar el token con la clave secreta y tiempo de expiración de 1 hora
  const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

  // Retornar el token generado
  return {
    access_token,
  };
}

// Método que valida las credenciales y devuelve el token si son correctas
async loginUser(loginDto: LoginUserDto) {
  // Validar usuario con email y contraseña
  const user = await this.validateUser(loginDto.email, loginDto.password);

  // Si no se encontró o la contraseña es incorrecta, lanzar excepción
  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Si es válido, generar y retornar el token JWT
  return this.login(user);
}

// Método para obtener todos los usuarios registrados en la base de datos
async findAll(): Promise<LoginUserDto[]> {
  return this.userRepository.find();
}


  // Método para iniciar el proceso de recuperación de contraseña
async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
  const { email } = dto;

  // Buscar usuario por email
  const user = await this.userRepository.findOne({ where: { email } });

  // Si no existe el usuario, retornar mensaje genérico para no revelar info
  if (!user) {
    return { message: 'Si el correo está registrado, recibirás un mensaje con instrucciones.' };
  }

  // Generar un token aleatorio para restablecer contraseña
  const token = crypto.randomBytes(32).toString('hex');

  // Establecer tiempo de expiración para el token (1 hora desde ahora)
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  // Guardar token y fecha de expiración en el usuario
  user.resetToken = token;
  user.resetTokenExpires = expires;
  await this.userRepository.save(user);

  // Construir el enlace que recibirá el usuario para restablecer la contraseña
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&tipo=usuario`;

  // Configurar el servicio de correo usando nodemailer y credenciales del entorno
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enviar correo con el enlace de recuperación al email del usuario
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Recuperación de contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  // Confirmar que el correo fue enviado correctamente
  return { message: 'Correo de recuperación enviado correctamente' };
}


// Método para restablecer la contraseña usando el token recibido
async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
  const { token, newPassword } = dto;

  // Buscar usuario con el token válido
  const user = await this.userRepository.findOne({ where: { resetToken: token } });

  // Validar que el token exista y no haya expirado
  if (!user || user.resetTokenExpires < new Date()) {
    throw new Error('Token inválido o expirado');
  }

  // Hashear la nueva contraseña antes de guardarla
  user.password = await bcrypt.hash(newPassword, 10);

  // Limpiar token y fecha para que no pueda reutilizarse
  user.resetToken = null;
  user.resetTokenExpires = null;

  // Guardar los cambios en la base de datos
  await this.userRepository.save(user);

  // Confirmar que la contraseña fue actualizada correctamente
  return { message: 'Contraseña actualizada con éxito' };
}

  
  

}
