import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { BebidasService } from './bebidas.service';
import { CreateBebidaDto } from './dto/create-bebida.dto';
import { UpdateBebidaDto } from './dto/update-bebida.dto';
import { BebidaEntity } from './entities/bebida.entity';

@Controller('bebidas')
export class BebidasController {
  constructor(private readonly bebidasService: BebidasService) {}

// Aplica un ValidationPipe para validar datos automáticamente
@UsePipes(ValidationPipe)
// Método GET para obtener todas las bebidas
@Get()
async getBebidas() {
  // Llama al servicio y devuelve la lista de bebidas
  return this.bebidasService.getBebidas();
}


@UsePipes(ValidationPipe)
// Método GET para obtener una bebida por su ID
@Get(':id')
async gerBebidaById(@Param('id') id: number) {
  // Busca y devuelve la bebida con el ID dado
  return this.bebidasService.buscarBebidaId(id);
}

// Método POST para crear una nueva bebida
@Post()
async create(@Body() createBebidaDto: CreateBebidaDto) {
  // Llama al servicio para guardar la nueva bebida
  return this.bebidasService.createBebida(createBebidaDto);
}

// Método PATCH para actualizar una bebida por su ID
@Patch(':id')
async update(@Param('id') id: number, @Body() updateBebidaDto: UpdateBebidaDto) {
  // Llama al servicio para modificar la bebida
  return this.bebidasService.update(id, updateBebidaDto);
}

// Aplica validaciones automáticas
@UsePipes(ValidationPipe)
// Método DELETE para eliminar una bebida por su ID
@Delete(':id')
async deleteBebida(@Param('id') id: number) {
  // Elimina la bebida y devuelve el resultado
  return await this.bebidasService.deleteBebida(id);
}


   // ✅ ENDPOINT PARA OCULTAR BEBIDA
  @Patch(':id/ocultar')
  async ocultar(@Param('id', ParseIntPipe) id: number): Promise<BebidaEntity> {
    return await this.bebidasService.ocultarBebida(id);
  }

  // ✅ ENDPOINT PARA MOSTRAR BEBIDA
  @Patch(':id/mostrar')
  async mostrar(@Param('id', ParseIntPipe) id: number): Promise<BebidaEntity> {
    return await this.bebidasService.mostrarBebida(id);
  }
}
