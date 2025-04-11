import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUrl } from 'class-validator';

export class CreatePlatoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsString()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  imagen: string;
}
