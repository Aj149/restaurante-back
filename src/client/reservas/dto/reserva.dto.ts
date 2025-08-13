// create-reserva.dto.ts
import { IsEmail, IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class CreateReservaDto {
  

   @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
  nombre: string;

  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido.' })
  email: string;

  @IsString({ message: 'El teléfono es obligatorio y debe ser un texto.' })
  telefono: string;

  @IsInt({ message: 'El lugar seleccionado no es válido.' })
  lugar_id: number;

  @IsInt({ message: 'El horario seleccionado no es válido.' })
  horario_id: number;

  @IsDateString({}, { message: 'La fecha debe tener el formato YYYY-MM-DD.' })
  fecha: string; 

  @IsInt({ message: 'Debe ingresar un número válido de personas.' })
  @Min(1, { message: 'Debe haber al menos 1 persona en la reserva.' })
  n_personas: number;

  @IsOptional()
  @IsString({ message: 'Los detalles deben ser un texto.' })
  detalles?: string;
}
