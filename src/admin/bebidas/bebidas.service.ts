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

  async getBebidas(): Promise<BebidaEntity[]> {
    const list = await this.bebidaRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: "No hay bebidas disponibles" });
    }
    return list;
  }

  async buscarBebidaId(id_bebida: number): Promise<BebidaEntity> {
    const bebida = await this.bebidaRepository.findOne({
      where: { id_bebida: id_bebida },
    });
    if (!bebida) {
      throw new NotFoundException({ message: "Esta bebida no existe" });
    }
    return bebida;
  }

  async createBebida(createBebidaDto: CreateBebidaDto) {
    const bebida = this.bebidaRepository.create(createBebidaDto);
    await this.bebidaRepository.save(bebida);
    return { message: `La bebida ${bebida.nombre} ha sido creada` };
  }



  async update(id_bebida: number, updateBebidaDto: UpdateBebidaDto) {
    const bebida = await this.buscarBebidaId(id_bebida);
    if (!bebida) {
      throw new NotFoundException('No existe la bebida');
    }
    Object.assign(bebida, updateBebidaDto);
    await this.bebidaRepository.save(bebida);
    return { message: `Bebida con ID ${bebida.id_bebida} actualizada` };
  }

  async deleteBebida(id_bebida: number) {
    const bebida = await this.buscarBebidaId(id_bebida);
    if (!bebida) {
      throw new NotFoundException('No existe la bebida');
    }
    await this.bebidaRepository.delete(bebida.id_bebida);
    return { message: `Bebida con ID ${bebida.id_bebida} eliminada` };
  }
}
