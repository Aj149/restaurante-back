import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosEntity } from './comentarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComentariosEntity])],
  providers: [ComentariosService],
  controllers: [ComentariosController]
})
export class ComentariosModule {}
