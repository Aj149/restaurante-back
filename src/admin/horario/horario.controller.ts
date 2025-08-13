import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { DiaSemana } from '../lugares/dias.enum';
import { CreateHorarioDto } from './dto/create-horario.dto';


@Controller('horarios')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

// Obtener horarios filtrados por día
@Get('dia/:dia')
async findByDiaConLugar(@Param('dia') dia: DiaSemana) {
  // Llama al servicio para buscar horarios según el día (con su lugar asociado)
  return this.horarioService.findByDiaConLugar(dia);
}

// Obtener horarios filtrados por lugar
@Get('lugar/:id_lugar')
async getHorariosPorLugar(@Param('id_lugar', ParseIntPipe) id_lugar: number) {
  // Llama al servicio para buscar horarios según el ID del lugar
  return this.horarioService.getHorariosPorLugar(id_lugar);
}

// Obtener horarios filtrados por lugar y día
@Get('lugar/:id_lugar/dia/:dia')
async getHorariosPorLugarYDia(
  @Param('id_lugar', ParseIntPipe) id_lugar: number,
  @Param('dia') dia: DiaSemana,
) {
  // Llama al servicio para buscar horarios que coincidan con lugar y día
  return this.horarioService.findByLugarYDia(id_lugar, dia);
}

// Crear un nuevo horario
@Post()
createHorario(@Body() createHorarioDto: CreateHorarioDto) {
  // Llama al servicio para guardar un nuevo horario
  return this.horarioService.create(createHorarioDto);
}

// Actualizar un horario existente
@Patch(':id')
updateHorario(
  @Param('id', ParseIntPipe) id: number, 
  @Body() updateHorarioDto: Partial<CreateHorarioDto>
) {
  // Llama al servicio para actualizar el horario según su ID
  return this.horarioService.update(id, updateHorarioDto);
}

// Eliminar un horario por ID
@Delete(':id')
deleteHorario(@Param('id', ParseIntPipe) id: number) {
  // Llama al servicio para eliminar el horario
  return this.horarioService.delete(id);
}







}
