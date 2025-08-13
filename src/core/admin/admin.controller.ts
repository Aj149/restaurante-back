import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto copy';
import { RecuperarPassword } from './dto/rescuperar-admin.dto copy';
import { ResetearPasswordDto } from './dto/reset-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  
  // Ruta POST para registrar un nuevo administrador
@Post('register')
async register(@Body() createAdminDto: CreateAdminDto) {
  // Validación para detectar bots: si el campo 'website' tiene texto, se rechaza la solicitud
  if (createAdminDto.website && createAdminDto.website.trim() !== '') {
    throw new BadRequestException('Bot detectado');
  }
  // Si pasa la validación, se llama al servicio para registrar el administrador
  return this.adminService.registerAdmin(createAdminDto);
}

// Ruta POST para iniciar sesión del administrador
@HttpCode(HttpStatus.OK) // Establece el código HTTP 200 explícitamente para el login
@Post('login')
async login(@Body() loginAdminDto: LoginAdminDto) {
  // Llama al servicio para validar credenciales y generar token de acceso
  return this.adminService.loginAdmin(loginAdminDto);
}

// Ruta POST para solicitar recuperación de contraseña (envía email, token, etc.)
@Post('forgot-password')
async forgotPassword(@Body() dto: RecuperarPassword): Promise<{ message: string }> {
  try {
    // Llama al servicio para procesar la solicitud de recuperación de contraseña
    return await this.adminService.contrasenaOlvidada(dto);
  } catch (error) {
    // En caso de error interno, se registra y lanza una excepción genérica para el cliente
    console.error('Error en forgotPassword:', error);
    throw new InternalServerErrorException('Error al procesar la solicitud');
  }
}

// Ruta POST para restablecer la contraseña usando token y nueva contraseña
@Post('reset-password')
async resetPassword(@Body() dto: ResetearPasswordDto): Promise<{ message: string }> {
  try {
    // Llama al servicio que verifica el token y actualiza la contraseña
    return await this.adminService.resetPassword(dto);
  } catch (error) {
    // Manejo de errores similar al anterior
    console.error('Error en resetPassword:', error);
    throw new InternalServerErrorException('Error al procesar la solicitud');
  }
}

}
