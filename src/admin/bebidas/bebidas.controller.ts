import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { BebidasService } from './bebidas.service';
import { CreateBebidaDto } from './dto/create-bebida.dto';
import { UpdateBebidaDto } from './dto/update-bebida.dto';

@Controller('bebidas')
export class BebidasController {
  constructor(private readonly bebidasService: BebidasService) {}

  @UsePipes(ValidationPipe)
  @Get()
  async getBebidas() {
    return this.bebidasService.getBebidas();
  }
  
  @UsePipes(ValidationPipe)
  @Get(':id')
  async gerBebidaById(@Param('id') id: number) {
    return this.bebidasService.buscarBebidaId(id);
  }

  @Post()
  async create(@Body() createBebidaDto: CreateBebidaDto) {
    return this.bebidasService.createBebida(createBebidaDto);
  }



  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBebidaDto: UpdateBebidaDto) {
    return this.bebidasService.update(id, updateBebidaDto);
  }

  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deleteBebida(@Param('id') id: number) {
    return await this.bebidasService.deleteBebida(id);
  }
}
