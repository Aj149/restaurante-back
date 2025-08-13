import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // Crear un nuevo carrito con los datos enviados en el cuerpo de la petición
@Post()
create(@Body() createCarritoDto: CreateCarritoDto) {
  return this.carritoService.create(createCarritoDto);
}

// Ruta protegida, solo accesible si el usuario está autenticado vía JWT
@UseGuards(AuthGuard('jwt'))
@Get()
getCarritoData() {
  return { mensaje: 'Solo puedes ver esto si estás logueado' };
}

// Obtener un carrito por su ID (recibido como parámetro en la URL)
@Get(':id')
findOne(@Param('id') id: string) {
  return this.carritoService.findOne(+id); // Convierte id a número
}

// Actualizar un carrito existente por ID con los datos enviados en el cuerpo
@Patch(':id')
update(@Param('id') id: string, @Body() updateCarritoDto: UpdateCarritoDto) {
  return this.carritoService.update(+id, updateCarritoDto);
}

// Eliminar un carrito por su ID
@Delete(':id')
remove(@Param('id') id: string) {
  return this.carritoService.remove(+id);
}

}
