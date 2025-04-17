import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Controller('platos')
export class PlatosController {
  constructor(private readonly platosService: PlatosService) {}

 @UsePipes(ValidationPipe)
 @Get()
 async getPlatos() {
    return this.platosService.getPlatos();
  }

  @UsePipes(ValidationPipe)
  @Get(':id')
  async getPlatoById(@Param('id') id: number) {
    return this.platosService.buscarPlatoId(id);
  }

  @Post()
  async createPlato(@Body() createPlatoDto: CreatePlatoDto) {
    return await this.platosService.createPlato(createPlatoDto);
  }

  @Patch(':id')
  async updatePlato(@Param('id') id: number, @Body() updatePlatoDto: UpdatePlatoDto) {
    return await this.platosService.updatePlato(id, updatePlatoDto);
  }
  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deletePlato(@Param('id') id: number) {
    return await this.platosService.deletePlato(id);
  }
}