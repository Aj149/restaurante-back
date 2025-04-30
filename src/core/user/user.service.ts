// users.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Observable } from 'rxjs';

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
}
