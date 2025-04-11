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
  async getPlatos(): Promise<PlatoEntity[]> {
        const list = await this.platoRepository.find();
        if(!list.length){
            throw new NotFoundException({message: "no hay platos"});
        }
        return list;
    }

   async buscarPlatoId(id_plato: number):Promise<PlatoEntity>{
          const plato = await this.platoRepository.findOne({
              where: {id_plato: id_plato},
          })
          if(!plato){
              throw new NotFoundException({message: "este plato no existe"});
          }
          return plato;
      }

      async buscarPorNombre(nombre: string) {
        const plato = await this.platoRepository.findOne({ where: { nombre } });
        if (!plato) {
        throw new NotFoundException({ message: 'No existe el plato con este nombre' });
        }
        return plato;
    } 

    async createPlato(createPlatosDto: CreatePlatoDto){
            const plato = this.platoRepository.create(createPlatosDto);
            await this.platoRepository.save(plato);
            return {message: `La plato para ${plato.nombre} ha sido creada`};
        }


         async updatePlato(id_plato: number, updateDto: UpdatePlatoDto){
                const plato = await this.buscarPlatoId(id_plato);
                if (!plato) {
                  throw new NotFoundException('No existe el plato');
                }
                Object.assign(plato, UpdatePlatoDto);
                await this.platoRepository.save(plato);
                return {message: `plato con ID ${plato.id_plato} actualizado`};
              }


              async deletePlato(id_plato: number) {
                const plato = await this.buscarPlatoId(id_plato);
                if (!plato) {
                    throw new NotFoundException(`La plato con ID ${id_plato} no existe`);
                }
                await this.platoRepository.delete(plato.id_plato);
                return {message: `Plato con ID ${plato.id_plato} eliminada`};
            }
}
