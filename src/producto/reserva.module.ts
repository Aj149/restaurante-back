import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ProductoController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntity } from './reserva.entity';


@Module({
  imports:[TypeOrmModule.forFeature([ReservaEntity])],
  providers: [ReservaService],
  controllers: [ProductoController],
})
export class ReservaModule {}
