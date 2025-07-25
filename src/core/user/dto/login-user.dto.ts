import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginUserDto  {

  @IsOptional()
  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
  }
  
