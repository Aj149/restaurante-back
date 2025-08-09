import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesFacturaDto } from './create-detalles-factura.dto';

export class UpdateDetallesFacturaDto extends PartialType(CreateDetallesFacturaDto) {}
