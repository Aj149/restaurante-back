import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntity } from './reserva.entity';
import { Horario } from 'src/admin/horario/entities/horario.entity';
import { LugaresEntity } from 'src/admin/lugares/entities/lugare.entity';


@Module({
  imports:[TypeOrmModule.forFeature([ReservaEntity, Horario, LugaresEntity])],
  providers: [ReservaService],
  controllers: [ReservaController],
})
export class ReservaModule {}
