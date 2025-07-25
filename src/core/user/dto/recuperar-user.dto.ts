
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsString()
  email: string;
  
}
