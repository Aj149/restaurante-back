import { PartialType } from '@nestjs/mapped-types';
import { CreateBebidaDto } from './create-bebida.dto';

export class UpdateBebidaDto extends PartialType(CreateBebidaDto) {}
