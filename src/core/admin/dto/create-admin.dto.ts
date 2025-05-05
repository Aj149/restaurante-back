import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {

    
    @IsNotEmpty({ message: 'cedula inválida' })
    @IsString()
    cedula: string;

  
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}
