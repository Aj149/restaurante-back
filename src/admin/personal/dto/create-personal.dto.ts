import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString, IsNumber, Min, IsIn } from 'class-validator';

export class CreatePersonalDto {
  @IsOptional()
  @IsNumber()
  id_persona?: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  cedula: string; // mejor como string

  @IsString()
  @IsNotEmpty()
  nacionalidad: string;

  @IsOptional()
  @IsString()
  imagen: string;

  @IsString()
  @IsNotEmpty()
  puesto: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_contratacion: string;

  @IsDateString()
  @IsOptional()
  fecha_nacimiento: string;

  @IsNumber()
  @Min(0)
  salario: number;

  @IsOptional()
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Otro']) // puedes modificar según tus valores válidos
  genero: string;

  @IsOptional()
  @IsString()
  jornadaLaboral: string;
 
  @IsOptional()
  @IsString()
  descripcion: string;
}
