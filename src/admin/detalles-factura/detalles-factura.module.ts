import { Module } from '@nestjs/common';
import { DetallesFacturaService } from './detalles-factura.service';
import { DetallesFacturaController } from './detalles-factura.controller';
import { DetalleFactura } from './entities/detalles-factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from '../factura/entities/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleFactura])],
  controllers: [DetallesFacturaController],
  providers: [DetallesFacturaService],
})
export class DetallesFacturaModule {}
