import { Controller, Post, Body, HttpCode, HttpStatus, Get, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './dto/recuperar-user.dto';
import { ResetPasswordDto } from './dto/resert-user.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // Ruta POST para registrar un nuevo usuario
@Post('registro')
async register(@Body() createUserDto: CreateUserDto) {
  // Validación anti-bot: si el campo 'website' tiene texto, se rechaza la solicitud
  if (createUserDto.website && createUserDto.website.trim() !== '') {
    throw new BadRequestException('Bot detectado');
  }
  // Llama al servicio para crear el usuario con los datos recibidos
  return this.usersService.register(createUserDto);
}

// Ruta POST para iniciar sesión de usuario
@HttpCode(HttpStatus.OK)  // Fuerza que la respuesta tenga código HTTP 200
@Post('login')
async login(@Body() loginDto: LoginUserDto) {
  // Llama al servicio que valida las credenciales y devuelve el token JWT
  return this.usersService.loginUser(loginDto); 
}

// Ruta GET para obtener todos los usuarios registrados
@Get('registro') 
findAll() {
  // Llama al servicio para obtener la lista de usuarios
  return this.usersService.findAll();
}

// Ruta POST para solicitar recuperación de contraseña (envía email con instrucciones)
@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
  try {
    // Llama al servicio para iniciar proceso de recuperación
    return await this.usersService.forgotPassword(dto);
  } catch (error) {
    // En caso de error interno, registra y lanza una excepción genérica
    console.error('Error en forgotPassword:', error);
    throw new InternalServerErrorException('Error al procesar la solicitud');
  }
}

// Ruta POST para restablecer contraseña usando token y nueva contraseña
@Post('reset-password')
async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
  try {
    // Llama al servicio que valida token y actualiza contraseña
    return await this.usersService.resetPassword(dto);
  } catch (error) {
    // Manejo de errores igual que en forgotPassword
    console.error('Error en resetPassword:', error);
    throw new InternalServerErrorException('Error al procesar la solicitud');
  }
}

  

}

  


