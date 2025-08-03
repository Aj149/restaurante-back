import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { DiaSemana } from '../lugares/dias.enum';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { LugaresEntity } from '../lugares/entities/lugare.entity';




@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ) {}

  async findAllByDia(dia: DiaSemana): Promise<Horario[]> {
    return this.horarioRepository.find({ where: { dia } });
  }

  async findByDia(dia: DiaSemana): Promise<Horario[]> {
    return this.horarioRepository.find({ where: { dia } });
  }

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
  const { id_lugar, ...rest } = createHorarioDto;
  const horario = this.horarioRepository.create(rest);

  // asignar el lugar para la relación ManyToOne
  horario.lugar = { id_lugar } as LugaresEntity;

  return this.horarioRepository.save(horario);
}


  async update(id: number, updateHorarioDto: Partial<CreateHorarioDto>): Promise<Horario> {
  const horario = await this.horarioRepository.findOne({ where: { id }, relations: ['lugar'] });
  if (!horario) throw new NotFoundException('Horario no encontrado');

  Object.assign(horario, updateHorarioDto);

  // Si en updateHorarioDto viene id_lugar, actualiza la relación (opcional)
  if (updateHorarioDto.id_lugar) {
    horario.lugar = { id_lugar: updateHorarioDto.id_lugar } as LugaresEntity;
  }

  return this.horarioRepository.save(horario);
}


  async delete(id: number): Promise<void> {
    const result = await this.horarioRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Horario no encontrado');
  }




   // En HorariosService (o como lo tengas llamado)
async findByDiaConLugar(dia: DiaSemana): Promise<Horario[]> {
  return await this.horarioRepository.find({
    where: { dia },
    relations: ['lugar'], // aquí cargas la relación lugar para cada horario
  });
}



// HorarioService.ts
async getHorariosPorLugar(id_lugar: number): Promise<Horario[]> {
  return this.horarioRepository.find({
    where: { lugar: { id_lugar } },
    relations: ['lugar'], // opcional, si quieres info del lugar también
  });
}

async findByLugarYDia(id_lugar: number, dia: DiaSemana): Promise<Horario[]> {
  return this.horarioRepository.find({
    where: { 
      lugar: { id_lugar }, 
      dia 
    },
    relations: ['lugar'],
  });
}


}
