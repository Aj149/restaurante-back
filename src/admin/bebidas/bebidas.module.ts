import { Module } from '@nestjs/common';
import { BebidasService } from './bebidas.service';
import { BebidasController } from './bebidas.controller';
import { BebidaEntity } from './entities/bebida.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BebidaEntity])],
  controllers: [BebidasController],
  providers: [BebidasService],
})
export class BebidasModule {}
