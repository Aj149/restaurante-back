
import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './reserva.dto';
export class UpdateReservaDto extends PartialType(CreateReservaDto) {}
