import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateReservaDto{

@IsString()
nombre: string;

@IsEmail()
email: string;

  @IsNumber()
  telefono: number;


@IsString()
lugar: string;

@IsNumber()
n_personas: number;


@Column({ type: 'date' })
fecha: Date;


@Column({ type: 'varchar'})
hora: string;
}