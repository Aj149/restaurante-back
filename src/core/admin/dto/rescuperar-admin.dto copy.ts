import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RecuperarPassword {

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'Correo inválido' })
  correo: string;
}
