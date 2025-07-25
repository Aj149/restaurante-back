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

  // Registro con validación anti-bots
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    if (createAdminDto.website && createAdminDto.website.trim() !== '') {
      throw new BadRequestException('Bot detectado');
    }
    return this.adminService.registerAdmin(createAdminDto);
  }

  // Autenticación de administrador
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.loginAdmin(loginAdminDto);
  }

  // Recuperar contraseña
  @Post('forgot-password')
  async forgotPassword(@Body() dto: RecuperarPassword): Promise<{ message: string }> {
    try {
      return await this.adminService.contrasenaOlvidada(dto);
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  // Resetear contraseña
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetearPasswordDto): Promise<{ message: string }> {
    try {
      return await this.adminService.resetPassword(dto);

    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }
}
