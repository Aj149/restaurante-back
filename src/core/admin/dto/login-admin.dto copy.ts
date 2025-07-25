import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class LoginAdminDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsNumberString({}, { message: 'La cédula debe contener solo números' })
  cedula: number;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;

  
}
