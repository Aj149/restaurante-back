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
    async getLugares(): Promise<LugaresEntity[]> {
          const list = await this.lugaresRepository.find();
          if(!list.length){
              throw new NotFoundException({message: "no hay lugares"});
          }
          return list;
      }
  
     async buscarLugarId(id_lugar: number):Promise<LugaresEntity>{
            const lugar = await this.lugaresRepository.findOne({
                where: {id_lugar: id_lugar},
            })
            if(!lugar){
                throw new NotFoundException({message: "este lugar no existe"});
            }
            return lugar;
        }
  
        async buscarPorNombre(nombre: string) {
          const lugar = await this.lugaresRepository.findOne({ where: { nombre } });
          if (!lugar) {
          throw new NotFoundException({ message: 'No existe el lugar con este nombre' });
          }
          return lugar;
      } 

      // buscar con horarios

     



  
      async createLugar(CreateLugareDto: CreateLugareDto){
              const lugar = this.lugaresRepository.create(CreateLugareDto);
              await this.lugaresRepository.save(lugar);
              return {message: `La lugar para ${lugar.nombre} ha sido creada`};
          }
  
  
           async updateLugar(id_lugar: number, UpdateLugareDto: UpdateLugareDto){
                  const lugar = await this.buscarLugarId(id_lugar);
                  if (!lugar) {
                    throw new NotFoundException('No existe el lugar');
                  }
                  Object.assign(lugar, UpdateLugareDto);
                  await this.lugaresRepository.save(lugar);
                  return {message: `lugar con ID ${lugar.id_lugar} actualizado`};
                }
  
  
                async borrarLugar(id_lugar: number) {
                  const lugar = await this.buscarLugarId(id_lugar);
                  if (!lugar) {
                      throw new NotFoundException(`La lugar con ID ${id_lugar} no existe`);
                  }
                  await this.lugaresRepository.delete(lugar.id_lugar);
                  return {message: `Lugar con ID ${lugar.id_lugar} eliminada`};
          }
}
