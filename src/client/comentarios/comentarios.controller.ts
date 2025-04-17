import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateComentariosDto } from './dto/comentarios.dto';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService:ComentariosService){}


    @UsePipes(ValidationPipe)
    @Get()
    async getcomentario(){
        return this.comentariosService.getComentario();
    }

    @UsePipes(ValidationPipe)
  @Get(':id')
  async getReservaById(@Param('id', ParseIntPipe) id: number) {
    return this.comentariosService.findById(id);
  }

  @Post()
  async createComentario(@Body() CreateComentariosDto: CreateComentariosDto) {
    return await this.comentariosService.createComentario(CreateComentariosDto);
  }

  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deletecomentario(@Param('id', ParseIntPipe) id: number){
    return this.comentariosService.deleteComentario(id);
  }

}
