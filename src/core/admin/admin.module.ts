import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';  // Asegúrate de que esta ruta sea correcta

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],  // Importa el repositorio para Admin
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
