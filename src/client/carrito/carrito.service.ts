import { Injectable } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Injectable()
export class CarritoService {
  create(createCarritoDto: CreateCarritoDto) {
  return ' añade un nuevo carrito';
}

findAll() {
  return `devuelve todos los carritos`;
}

findOne(id: number) {
  return ` devuelve el carrito #${id}`;
}

update(id: number, updateCarritoDto: UpdateCarritoDto) {
  return `actualiza el carrito #${id}`;
}

remove(id: number) {
  return ` elimina el carrito #${id}`;
}
}
