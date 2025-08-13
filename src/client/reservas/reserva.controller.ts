import { Controller, Get, Post, Put, Delete, Param, Body, Patch, NotFoundException, UsePipes, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';



@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

// Obtener todas las reservas con validación de datos
@UsePipes(ValidationPipe)
@Get()
async getReservas() {
  return this.reservaService.getReserva();
}

// Obtener una reserva por su ID con validación y conversión de tipo
@UsePipes(ValidationPipe)
@Get(':id')
async getReservaById(@Param('id', ParseIntPipe) id: number) {
  return this.reservaService.findById(id);
}

// Obtener horarios disponibles para un lugar y fecha específicos
@Get('horarios-disponibles')
async getHorariosDisponibles(
  @Query('lugarId', ParseIntPipe) lugarId: number,
  @Query('fecha') fecha: string,
) {
  // Validar que los parámetros existan
  if (!lugarId || !fecha) {
    throw new NotFoundException('Faltan parámetros lugarId o fecha');
  }
  // Obtener horarios disponibles a través del servicio
  return this.reservaService.getHorariosDisponibles(lugarId, fecha);
}

// Crear una nueva reserva con los datos enviados en el cuerpo
@Post()
async createReserva(@Body() createReservaDto: CreateReservaDto) {
  return this.reservaService.createReserva(createReservaDto);
}

// Actualizar parcialmente una reserva por ID con validación
@UsePipes(ValidationPipe)
@Patch(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateReservaDto: UpdateReservaDto
) {
  const reserva = await this.reservaService.updateReserva(id, updateReservaDto);
  if (!reserva) {
    throw new NotFoundException('No existe la reserva');
  }
  return { message: `Reserva con ID ${id} actualizada` };
}

// Actualización completa de una reserva (PUT) con validación
@UsePipes(ValidationPipe)
@Put(':id')
async updateComplete(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateReservaDto: UpdateReservaDto
) {
  const reserva = await this.reservaService.updateReserva(id, updateReservaDto);
  if (!reserva) {
    throw new NotFoundException('No existe la reserva');
  }
  return reserva;
}

// Eliminar una reserva por ID con validación
@UsePipes(ValidationPipe)
@Delete(':id')
async deleteReserva(@Param('id', ParseIntPipe) id: number){
  return this.reservaService.deleteReserva(id);
}

}
