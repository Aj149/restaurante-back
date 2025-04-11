import { Controller, Get, Post, Put, Delete, Param, Body, Patch, NotFoundException, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Capacidad, Lugar } from './enums/lugares';


@Controller('reserva')
export class ProductoController {
  constructor(private readonly reservaService: ReservaService) {}


  @Get('lugares')
  getLugares() {
    return {
      lugares: Object.values(Lugar),
      capacidades: {
        [Lugar.LUGAR_1]: Capacidad.LUGAR_1,
        [Lugar.LUGAR_2]: Capacidad.LUGAR_2,
        [Lugar.LUGAR_3]: Capacidad.LUGAR_3,
        [Lugar.LUGAR_4]: Capacidad.LUGAR_4,
      },
    };
   }



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
  return reserva;
}



  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deleteReserva(@Param('id', ParseIntPipe) id: number){
    return this.reservaService.deleteReserva(id);
  }
}
