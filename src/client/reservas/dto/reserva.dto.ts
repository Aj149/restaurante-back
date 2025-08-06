// create-reserva.dto.ts
import { IsEmail, IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class CreateReservaDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @IsInt()
  lugar_id: number;

  @IsInt()
  horario_id: number;

  @IsDateString()
  fecha: string; // formato "YYYY-MM-DD"

  @IsInt()
  @Min(1)
  n_personas: number;

  @IsOptional()
  @IsString()
  detalles?: string;
}
