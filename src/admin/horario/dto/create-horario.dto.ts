import { IsEnum, IsString, IsNotEmpty, Matches, IsInt } from 'class-validator';
import { DiaSemana } from 'src/admin/lugares/dias.enum';


export class CreateHorarioDto {
  @IsEnum(DiaSemana)
  dia: DiaSemana;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'horaInicio debe ser HH:mm' })
  horaInicio: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'horaFin debe ser HH:mm' })
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  estado: string; // Validar que sea 'Disponible' o 'Ocupado' en lógica de negocio

    @IsInt()
  id_lugar: number; 
}
