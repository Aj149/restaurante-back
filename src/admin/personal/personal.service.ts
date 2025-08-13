import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { In, Repository } from 'typeorm';
import { PersonalEntity } from './entities/personal.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonalService {

  constructor(
    @InjectRepository(PersonalEntity) private readonly personalRepository: Repository<PersonalEntity>
  ) {}

  // Obtener lista de todo el personal
async getPersonal(): Promise<PersonalEntity[]> {
  const list = await this.personalRepository.find();

  // Si no hay personal registrado, lanza excepción
  if (!list.length) {
    throw new NotFoundException({ message: "No hay personal registrado" });
  }

  return list; // Devuelve la lista de personal
}

// Buscar personal por su ID
async buscarPersonalId(id_persona: number): Promise<PersonalEntity> {
  const personal = await this.personalRepository.findOne({
    where: { id_persona: id_persona },
  });

  // Si no existe, lanza excepción
  if (!personal) {
    throw new NotFoundException({ message: "Este personal no existe" });
  }

  return personal; // Devuelve el personal encontrado
}

// Buscar personal por nombre
async buscarPorNombre(nombre: string): Promise<PersonalEntity> {
  const personal = await this.personalRepository.findOne({ where: { nombre } });

  // Si no existe, lanza excepción
  if (!personal) {
    throw new NotFoundException({ message: 'No existe el personal con este nombre' });
  }

  return personal; // Devuelve el personal encontrado
}

// Crear un nuevo personal
async createPersonal(createPersonalDto: CreatePersonalDto) {
  const personal = this.personalRepository.create(createPersonalDto);

  // Guarda el personal en la base de datos
  await this.personalRepository.save(personal);

  return { message: `El personal ${personal.nombre} ha sido creado` };
}

// Actualizar datos de un personal existente
async updatePersonal(id: number, updatePersonalDto: UpdatePersonalDto) {
  const personal = await this.buscarPersonalId(id);

  // Validación redundante (buscarPersonalId ya lanza excepción si no existe)
  if (!personal) {  
    throw new NotFoundException('No existe el personal');
  }

  // Actualiza los datos con los nuevos valores
  Object.assign(personal, updatePersonalDto);

  // Guarda los cambios
  await this.personalRepository.save(personal);

  return { message: `Personal con ID ${personal.id_persona} actualizado` };
}

// Eliminar un personal por ID
async deletePersonal(id: number) {
  const personal = await this.buscarPersonalId(id);

  // Validación redundante
  if (!personal) {
    throw new NotFoundException('No existe el personal');
  }

  // Elimina el registro
  await this.personalRepository.delete(personal.id_persona);

  return { message: `Personal con ID ${id} eliminado` };
}

}
