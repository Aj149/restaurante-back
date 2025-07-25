import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUrl } from "class-validator";

export class CreateBebidaDto {

    @IsOptional()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsOptional()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsOptional()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  imagen: string;
}
