import { IsInt, Min, IsNumber } from "class-validator";

export class CreateDetallesFacturaDto {

   @IsNumber()
  platoId: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
