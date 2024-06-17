import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservaEntity } from './reserva.entity';
import { Repository } from 'typeorm';

import { CreateReservaDto } from './dto/reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservaService {

    constructor(
@InjectRepository(ReservaEntity)private readonly reservaRepository: Repository<ReservaEntity>
    ){}
    async getReserva(): Promise<ReservaEntity[]> {
        const list = await this.reservaRepository.find();
        if(!list.length){
            throw new NotFoundException({message: "no hay reservas"});
        }
        return list;
    }

    async findById(id_reserva: number):Promise<ReservaEntity>{
        const reserva = await this.reservaRepository.findOne({
            where: {id_reserva: id_reserva},
        })
        if(!reserva){
            throw new NotFoundException({message: "esta reserva no existe"});
        }
        return reserva;
    }
    
    async findOneByNombre(nombre: string) {
        const reserva = await this.reservaRepository.findOne({ where: { nombre } });
        if (!reserva) {
        throw new NotFoundException({ message: 'No existe la reserva con este nombre' });
        }
        return reserva;
    }    
    
    async createReserva(createReservaDto: CreateReservaDto){
        const reserva = this.reservaRepository.create(createReservaDto);
        await this.reservaRepository.save(reserva);
        return {message: `La reserva para ${reserva.nombre} ha sido creada`};
    }
    
    async updateReserva(id_reserva: number, updateReservaDto: UpdateReservaDto){
        const reserva = await this.findById(id_reserva);
        if (!reserva) {
          throw new NotFoundException('No existe la reserva');
        }
        Object.assign(reserva, updateReservaDto);
        await this.reservaRepository.save(reserva);
        return {message: `reserva con ID ${reserva.id_reserva} actualizado`};
      }

      async deleteReserva(id_reserva: number) {
        const reserva = await this.findById(id_reserva);
        if (!reserva) {
            throw new NotFoundException(`La reserva con ID ${id_reserva} no existe`);
        }
        await this.reservaRepository.delete(reserva.id_reserva);
        return {message: `Reserva con ID ${reserva.id_reserva} eliminada`};
    }
    


}