import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { DiaSemana } from '../lugares/dias.enum';
import { CreateHorarioDto } from './dto/create-horario.dto';


@Controller('horarios')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @Get('dia/:dia')
async findByDiaConLugar(@Param('dia') dia: DiaSemana) {
  return this.horarioService.findByDiaConLugar(dia);
}

// HorariosController.ts
@Get('lugar/:id_lugar')
async getHorariosPorLugar(@Param('id_lugar', ParseIntPipe) id_lugar: number) {
  return this.horarioService.getHorariosPorLugar(id_lugar);
}

@Get('lugar/:id_lugar/dia/:dia')
async getHorariosPorLugarYDia(
  @Param('id_lugar', ParseIntPipe) id_lugar: number,
  @Param('dia') dia: DiaSemana,
) {
  return this.horarioService.findByLugarYDia(id_lugar, dia);
}



  @Post()
  createHorario(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioService.create(createHorarioDto);
  }

  @Patch(':id')
updateHorario(@Param('id', ParseIntPipe) id: number, @Body() updateHorarioDto: Partial<CreateHorarioDto>) {
  return this.horarioService.update(id, updateHorarioDto);
}

@Delete(':id')
deleteHorario(@Param('id', ParseIntPipe) id: number) {
  return this.horarioService.delete(id);
}






}
