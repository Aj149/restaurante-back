import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { LugaresService } from './lugares.service';
import { CreateLugareDto } from './dto/create-lugare.dto';
import { UpdateLugareDto } from './dto/update-lugare.dto';

@Controller('lugares')
export class LugaresController {
constructor(private readonly lugaresService: LugaresService) {}

 @UsePipes(ValidationPipe)
 @Get()
 async getLugares() {
    return this.lugaresService.getLugares();
  }


  @UsePipes(ValidationPipe)
  @Get(':id')
  async getLugarById(@Param('id') id: number) {
    return this.lugaresService.buscarLugarId(id);
  }

  @Post()
  async createLugar(@Body() createLugareDto: CreateLugareDto) {
    return await this.lugaresService.createLugar(createLugareDto);
  }

  @Patch(':id')
  async updateLugar(@Param('id') id: number, @Body() updateLugareDto: UpdateLugareDto) {
    return await this.lugaresService.updateLugar(id, updateLugareDto);
  }
  @UsePipes(ValidationPipe)
  @Delete(':id')
  async borrarLugar(@Param('id') id: number) {
    return await this.lugaresService.borrarLugar(id);
  }
}
