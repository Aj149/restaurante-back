import { Injectable } from '@nestjs/common';
import { CreateDetallesFacturaDto } from './dto/create-detalles-factura.dto';
import { UpdateDetallesFacturaDto } from './dto/update-detalles-factura.dto';

@Injectable()
export class DetallesFacturaService {
  create(createDetallesFacturaDto: CreateDetallesFacturaDto) {
  return 'nuevo detallesFactura';
}

findAll() {
  return 'Esta acción devuelve todos los detallesFactura';
}

findOne(id: number) {
  return ` detallesFactura con ID #${id}`;
}

update(id: number, updateDetallesFacturaDto: UpdateDetallesFacturaDto) {
  return ` actualiza el detallesFactura con ID #${id}`;
}

remove(id: number) {
  return `elimina el detallesFactura con ID #${id}`;
}

}
