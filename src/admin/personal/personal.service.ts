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

  async getPersonal(): Promise<PersonalEntity[]> {
    const list = await this.personalRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: "No hay personal registrado" });
    }
    return list;
  }
  
  async buscarPersonalId(id_persona: number): Promise<PersonalEntity> {
    const personal = await this.personalRepository.findOne({
      where: { id_persona: id_persona },
    })
    if (!personal) {
      throw new NotFoundException({ message: "Este personal no existe" });
    }
    return personal;
  }

  async buscarPorNombre(nombre: string): Promise<PersonalEntity> {
    const personal = await this.personalRepository.findOne({ where: { nombre } });
    if (!personal) {
      throw new NotFoundException({ message: 'No existe el personal con este nombre' });
    }
    return personal;
  }

  async createPersonal(createPersonalDto: CreatePersonalDto) {
    const personal = this.personalRepository.create(createPersonalDto);
    await this.personalRepository.save(personal);
    return { message: `El personal ${personal.nombre} ha sido creado` };
  }



  async updatePersonal(id: number, updatePersonalDto: UpdatePersonalDto) {
    const personal = await this.buscarPersonalId(id);
    if (!personal) {  
      throw new NotFoundException('No existe el personal');
    }
    Object.assign(personal, updatePersonalDto);
    await this.personalRepository.save(personal);
    return { message: `Personal con ID ${personal.id_persona} actualizado` };
  }

  async deletePersonal(id: number) {
    const personal = await this.buscarPersonalId(id);
    if (!personal) {
      throw new NotFoundException('No existe el personal');
    }
    await this.personalRepository.delete(personal.id_persona);
    return { message: `Personal con ID ${id} eliminado` };
  }
}
