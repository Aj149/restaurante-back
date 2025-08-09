import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleFactura } from '../detalles-factura/entities/detalles-factura.entity';
import { UserEntity } from 'src/core/user/entities/user.entity';
import { PlatoEntity } from '../platos/entities/plato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, UserEntity, DetalleFactura, PlatoEntity])],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturaModule {}
