import { Controller, Post, Body, HttpCode, HttpStatus, Get, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './dto/recuperar-user.dto';
import { ResetPasswordDto } from './dto/resert-user.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('registro')
  async register(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.website && createUserDto.website.trim() !== '') {
      throw new BadRequestException('Bot detectado');
    }
    return this.usersService.register(createUserDto);
  }

 
  @HttpCode(HttpStatus.OK)
@Post('login')
async login(@Body() loginDto: LoginUserDto) {
  return this.usersService.loginUser(loginDto); 
}



  @Get('registro') 
  findAll() {
    return this.usersService.findAll();  // Llama al servicio para obtener los usuarios
  }
  // tener pendiente por si nesesito saber los administradores registrados

  
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      return await this.usersService.forgotPassword(dto);
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }
  

  // src/usuarios/usuarios.controller.ts

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      return await this.usersService.resetPassword(dto);
    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }
  

}

  


