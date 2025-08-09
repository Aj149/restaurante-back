import { Type } from "class-transformer";
import { IsInt, IsArray, ValidateNested, IsNumber } from "class-validator";
import { CreateDetallesFacturaDto } from "src/admin/detalles-factura/dto/create-detalles-factura.dto";

export class CreateFacturaDto {

  @IsNumber()
  usuarioId: number;

  @IsNumber()
  total: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  total_final: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetallesFacturaDto)
  detalles: CreateDetallesFacturaDto[];
}
