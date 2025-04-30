import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('usuarios')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('registro')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

 
  @HttpCode(HttpStatus.OK)
@Post('login')
async login(@Body() loginDto: LoginUserDto) {
  return this.usersService.loginUser(loginDto); // ← aquí está la solución
}



  @Get('registro') 
  findAll() {
    return this.usersService.findAll();  // Llama al servicio para obtener los usuarios
  }
  // tener pendiente por si nesesito saber los administradores registrados
}
