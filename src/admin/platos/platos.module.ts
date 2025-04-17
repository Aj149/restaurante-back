import { Module } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { PlatosController } from './platos.controller';
import { PlatoEntity } from './entities/plato.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PlatoEntity])],
  controllers: [PlatosController],
  providers: [PlatosService],
})
export class PlatosModule {}
