import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentariosEntity } from './comentarios.entity';
import { Repository } from 'typeorm';
import { CreateComentariosDto } from './dto/comentarios.dto';

@Injectable()
export class ComentariosService {

    constructor(@InjectRepository (ComentariosEntity) private readonly comentarioRepository: Repository<ComentariosEntity>){}

    async getComentario(): Promise<ComentariosEntity[]> {
        const list = await this.comentarioRepository.find();
        if(!list.length){
            throw new NotFoundException({message: "no hay comentario"})
        }
        return list;
    }

    async findById(id_comentario: number):Promise<ComentariosEntity>{
        const comentario = await this.comentarioRepository.findOne({
            where: {id_comentario: id_comentario},
        })
        if(!comentario){
            throw new NotFoundException({message: "este comentario no existe"});
        }
        return comentario;
    }


    async createComentario(CreateComentariosDto: CreateComentariosDto){
        const comentario = this.comentarioRepository.create(CreateComentariosDto);
        await this.comentarioRepository.save(comentario);
        return {message: `El comentario para ${comentario.nombre} ha sido creado`};
    }

    async deleteComentario(id_comentario: number) {
        const comentario = await this.findById(id_comentario);
        if (!comentario) {
            throw new NotFoundException(`La comentario con ID ${id_comentario} no existe`);
        }
        await this.comentarioRepository.delete(comentario.id_comentario);
        return {message: `comentario con ID ${comentario.id_comentario} eliminada`};
    }
    

}
