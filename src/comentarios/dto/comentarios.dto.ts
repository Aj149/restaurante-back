import { IsEmail, IsString, isString } from "class-validator";

export class CreateComentariosDto{

@IsString()
nombre: string;

@IsEmail()
email: string;

@IsString()
comentario: string;

}