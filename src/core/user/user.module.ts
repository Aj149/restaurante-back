import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'typeorm';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule, // para usar ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    // Aquí puedes agregar otros módulos que necesites importar
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtModule, UserService], // importante si otros módulos usan JWT
})
export class UserModule {}
