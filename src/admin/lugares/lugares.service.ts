import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLugareDto } from './dto/create-lugare.dto';
import { UpdateLugareDto } from './dto/update-lugare.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LugaresEntity } from './entities/lugare.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LugaresService {
  
  constructor(
      @InjectRepository(LugaresEntity) 
      private readonly lugaresRepository: Repository<LugaresEntity>
    ) {}
   // Obtener todos los lugares
async getLugares(): Promise<LugaresEntity[]> {
  // Busca todos los registros en la tabla de lugares
  const list = await this.lugaresRepository.find();

  // Si no hay registros, lanza excepción
  if (!list.length) {
    throw new NotFoundException({ message: "no hay lugares" });
  }

  return list; // Devuelve la lista de lugares
}

// Buscar un lugar por su ID
async buscarLugarId(id_lugar: number): Promise<LugaresEntity> {
  const lugar = await this.lugaresRepository.findOne({
    where: { id_lugar: id_lugar },
  });

  // Si no existe, lanza excepción
  if (!lugar) {
    throw new NotFoundException({ message: "este lugar no existe" });
  }

  return lugar; // Devuelve el lugar encontrado
}

// Buscar un lugar por su nombre
async buscarPorNombre(nombre: string) {
  const lugar = await this.lugaresRepository.findOne({ where: { nombre } });

  // Si no existe, lanza excepción
  if (!lugar) {
    throw new NotFoundException({ message: 'No existe el lugar con este nombre' });
  }

  return lugar; // Devuelve el lugar encontrado
}


      // buscar con horarios

     



  
      // Crear un nuevo lugar
async createLugar(CreateLugareDto: CreateLugareDto) {
  // Crea una nueva entidad a partir de los datos recibidos
  const lugar = this.lugaresRepository.create(CreateLugareDto);

  // Guarda la entidad en la base de datos
  await this.lugaresRepository.save(lugar);

  // Devuelve mensaje de confirmación
  return { message: `El lugar ${lugar.nombre} ha sido creado` };
}

// Actualizar un lugar existente
async updateLugar(id_lugar: number, UpdateLugareDto: UpdateLugareDto) {
  // Busca el lugar por su ID
  const lugar = await this.buscarLugarId(id_lugar);

  // Si no existe, lanza un error
  if (!lugar) {
    throw new NotFoundException('No existe el lugar');
  }

  // Mezcla los datos nuevos con los existentes
  Object.assign(lugar, UpdateLugareDto);

  // Guarda los cambios
  await this.lugaresRepository.save(lugar);

  return { message: `Lugar con ID ${lugar.id_lugar} actualizado` };
}

// Eliminar un lugar
async borrarLugar(id_lugar: number) {
  // Busca el lugar por su ID
  const lugar = await this.buscarLugarId(id_lugar);

  // Si no existe, lanza un error
  if (!lugar) {
    throw new NotFoundException(`El lugar con ID ${id_lugar} no existe`);
  }

  // Elimina el registro de la base de datos
  await this.lugaresRepository.delete(lugar.id_lugar);

  return { message: `Lugar con ID ${lugar.id_lugar} eliminado` };
}

}
