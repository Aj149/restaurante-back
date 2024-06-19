import { Controller, Get, Post, Put, Delete, Param, Body, Patch, NotFoundException, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';


@Controller('reserva')
export class ProductoController {
  constructor(private readonly reservaService: ReservaService) {}


  @UsePipes(ValidationPipe)
  @Get()
  async getReservas() {
    return this.reservaService.getReserva();
  }
  
  @UsePipes(ValidationPipe)
  @Get(':id')
  async getReservaById(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.findById(id);
  }

  
  @Post()
  async createReserva(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.createReserva(createReservaDto);
  }

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
  return {message: `Reserva con ID ${id} actualizada`};
}

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
  return reserva; // Devuelve directamente los datos de la reserva
}



  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deleteReserva(@Param('id', ParseIntPipe) id: number){
    return this.reservaService.deleteReserva(id);
  }
}
