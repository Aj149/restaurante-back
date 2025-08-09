import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesFacturaService } from './detalles-factura.service';
import { CreateDetallesFacturaDto } from './dto/create-detalles-factura.dto';
import { UpdateDetallesFacturaDto } from './dto/update-detalles-factura.dto';

@Controller('detalles-factura')
export class DetallesFacturaController {
  constructor(private readonly detallesFacturaService: DetallesFacturaService) {}

  @Post()
  create(@Body() createDetallesFacturaDto: CreateDetallesFacturaDto) {
    return this.detallesFacturaService.create(createDetallesFacturaDto);
  }

  @Get()
  findAll() {
    return this.detallesFacturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesFacturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesFacturaDto: UpdateDetallesFacturaDto) {
    return this.detallesFacturaService.update(+id, updateDetallesFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesFacturaService.remove(+id);
  }
}
