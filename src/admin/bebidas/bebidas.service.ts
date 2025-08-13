import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBebidaDto } from './dto/create-bebida.dto';
import { UpdateBebidaDto } from './dto/update-bebida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BebidaEntity } from './entities/bebida.entity';

@Injectable()
export class BebidasService {

  constructor(
    @InjectRepository(BebidaEntity) private readonly bebidaRepository: Repository<BebidaEntity>,
  ) {}

  // Método para obtener todas las bebidas
async getBebidas(): Promise<BebidaEntity[]> {
  // Busca todas las bebidas en la base de datos
  const list = await this.bebidaRepository.find();
  
  // Si no hay bebidas, lanza un error 404
  if (!list.length) {
    throw new NotFoundException({ message: "No hay bebidas disponibles" });
  }

  // Retorna la lista de bebidas encontradas
  return list;
}

// Método para buscar una bebida por su ID
async buscarBebidaId(id_bebida: number): Promise<BebidaEntity> {
  // Busca una bebida específica según el id_bebida
  const bebida = await this.bebidaRepository.findOne({
    where: { id_bebida: id_bebida },
  });

  // Si no existe, lanza un error 404
  if (!bebida) {
    throw new NotFoundException({ message: "Esta bebida no existe" });
  }

  // Retorna la bebida encontrada
  return bebida;
}

// Método para crear una nueva bebida
async createBebida(createBebidaDto: CreateBebidaDto) {
  // Crea una nueva instancia de bebida con los datos recibidos
  const bebida = this.bebidaRepository.create(createBebidaDto);

  // Guarda la nueva bebida en la base de datos
  await this.bebidaRepository.save(bebida);

  // Retorna un mensaje de confirmación
  return { message: `La bebida ${bebida.nombre} ha sido creada` };
}




// Método para actualizar una bebida existente
async update(id_bebida: number, updateBebidaDto: UpdateBebidaDto) {
  // Busca la bebida por ID (si no existe, lanza excepción)
  const bebida = await this.buscarBebidaId(id_bebida);

  // Validación redundante (buscarBebidaId ya lanza error si no existe)
  if (!bebida) {
    throw new NotFoundException('No existe la bebida');
  }

  // Copia los nuevos datos al objeto bebida
  Object.assign(bebida, updateBebidaDto);

  // Guarda la bebida actualizada en la base de datos
  await this.bebidaRepository.save(bebida);

  // Retorna mensaje de confirmación
  return { message: `Bebida con ID ${bebida.id_bebida} actualizada` };
}

// Método para eliminar una bebida existente
async deleteBebida(id_bebida: number) {
  // Busca la bebida por ID (si no existe, lanza excepción)
  const bebida = await this.buscarBebidaId(id_bebida);

  // Validación redundante
  if (!bebida) {
    throw new NotFoundException('No existe la bebida');
  }

  // Elimina la bebida de la base de datos usando su ID
  await this.bebidaRepository.delete(bebida.id_bebida);

  // Retorna mensaje de confirmación
  return { message: `Bebida con ID ${bebida.id_bebida} eliminada` };
}

}
