import { Injectable } from '@nestjs/common';
import { CreateDetallesFacturaDto } from './dto/create-detalles-factura.dto';
import { UpdateDetallesFacturaDto } from './dto/update-detalles-factura.dto';

@Injectable()
export class DetallesFacturaService {
  create(createDetallesFacturaDto: CreateDetallesFacturaDto) {
    return 'This action adds a new detallesFactura';
  }

  findAll() {
    return `This action returns all detallesFactura`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesFactura`;
  }

  update(id: number, updateDetallesFacturaDto: UpdateDetallesFacturaDto) {
    return `This action updates a #${id} detallesFactura`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesFactura`;
  }
}
