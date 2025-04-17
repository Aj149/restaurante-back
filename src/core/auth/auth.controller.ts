// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
async login(@Body() createAuthDto: CreateAuthDto) {
  return this.authService.validateLogin(createAuthDto.email, createAuthDto.password);
}

}
