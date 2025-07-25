import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsNumberString({}, { message: 'La cédula debe contener solo números' })
  cedula: number;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsOptional()
  @IsString()
  website?: string;
}
