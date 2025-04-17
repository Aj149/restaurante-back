import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.create(createCarritoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getCarritoData() {
    return { mensaje: 'Solo puedes ver esto si estás logueado' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carritoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritoService.update(+id, updateCarritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carritoService.remove(+id);
  }
}
