import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentariosEntity } from './comentarios.entity';
import { Repository } from 'typeorm';
import { CreateComentariosDto } from './dto/comentarios.dto';

@Injectable()
export class ComentariosService {

    constructor(@InjectRepository (ComentariosEntity) private readonly comentarioRepository: Repository<ComentariosEntity>){}

    // Obtener todos los comentarios
async getComentario(): Promise<ComentariosEntity[]> {
  const list = await this.comentarioRepository.find();

  // Si no hay comentarios, lanza error
  if (!list.length) {
    throw new NotFoundException({ message: "no hay comentario" });
  }

  return list; // Devuelve la lista de comentarios
}

// Buscar un comentario por su ID
async findById(id_comentario: number): Promise<ComentariosEntity> {
  const comentario = await this.comentarioRepository.findOne({
    where: { id_comentario: id_comentario },
  });

  // Si no existe, lanza error
  if (!comentario) {
    throw new NotFoundException({ message: "este comentario no existe" });
  }

  return comentario; // Devuelve el comentario encontrado
}

// Crear un nuevo comentario
async createComentario(CreateComentariosDto: CreateComentariosDto) {
  const comentario = this.comentarioRepository.create(CreateComentariosDto);

  // Guarda el comentario en la base de datos
  await this.comentarioRepository.save(comentario);

  return { message: `El comentario para ${comentario.nombre} ha sido creado` };
}

// Eliminar un comentario por su ID
async deleteComentario(id_comentario: number) {
  const comentario = await this.findById(id_comentario);

  // Validación redundante porque findById lanza error si no existe
  if (!comentario) {
    throw new NotFoundException(`El comentario con ID ${id_comentario} no existe`);
  }

  // Elimina el comentario de la base de datos
  await this.comentarioRepository.delete(comentario.id_comentario);

  return { message: `Comentario con ID ${comentario.id_comentario} eliminado` };
}


}
