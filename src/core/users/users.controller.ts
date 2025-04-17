// user.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';  // Asegúrate de tener el DTO de creación de usuarios

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un nuevo usuario (registro)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener un usuario por email (solo para pruebas, en un entorno real lo puedes proteger)
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
