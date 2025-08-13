import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { PlatoEntity } from './entities/plato.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class PlatosService {

  constructor(
    @InjectRepository(PlatoEntity) private readonly platoRepository: Repository<PlatoEntity>
  ) {}


  // Obtener todos los platos
async getPlatos(): Promise<PlatoEntity[]> {
  const list = await this.platoRepository.find();

  // Si no hay platos, lanza un error
  if (!list.length) {
    throw new NotFoundException({ message: "no hay platos" });
  }

  return list; // Devuelve la lista de platos
}

// Buscar un plato por su ID
async buscarPlatoId(id_plato: number): Promise<PlatoEntity> {
  const plato = await this.platoRepository.findOne({
    where: { id_plato: id_plato },
  });

  // Si no existe, lanza un error
  if (!plato) {
    throw new NotFoundException({ message: "este plato no existe" });
  }

  return plato; // Devuelve el plato encontrado
}

// Buscar un plato por nombre
async buscarPorNombre(nombre: string) {
  const plato = await this.platoRepository.findOne({ where: { nombre } });

  // Si no existe, lanza un error
  if (!plato) {
    throw new NotFoundException({ message: 'No existe el plato con este nombre' });
  }

  return plato; // Devuelve el plato encontrado
}

// Crear un nuevo plato
async createPlato(createPlatosDto: CreatePlatoDto) {
  const plato = this.platoRepository.create(createPlatosDto);

  // Guarda el nuevo plato en la base de datos
  await this.platoRepository.save(plato);

  return { message: `El plato ${plato.nombre} ha sido creado` };
}

// Actualizar un plato existente
async updatePlato(id_plato: number, updatePlatoDto: UpdatePlatoDto) {
  const plato = await this.buscarPlatoId(id_plato);

  // Validación redundante porque buscarPlatoId lanza error si no existe
  if (!plato) {
    throw new NotFoundException('No existe el plato');
  }

  // Actualiza los datos del plato con los valores nuevos
  Object.assign(plato, updatePlatoDto);

  // Guarda los cambios en la base de datos
  await this.platoRepository.save(plato);

  return { message: `Plato con ID ${plato.id_plato} actualizado` };
}

// Eliminar un plato por su ID
async deletePlato(id_plato: number) {
  const plato = await this.buscarPlatoId(id_plato);

  // Validación redundante
  if (!plato) {
    throw new NotFoundException(`El plato con ID ${id_plato} no existe`);
  }

  // Elimina el plato de la base de datos
  await this.platoRepository.delete(plato.id_plato);

  return { message: `Plato con ID ${plato.id_plato} eliminado` };
}

}
