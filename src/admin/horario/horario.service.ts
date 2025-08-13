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

  // Buscar todos los horarios de un día específico
async findAllByDia(dia: DiaSemana): Promise<Horario[]> {
  return this.horarioRepository.find({ where: { dia } });
}

// Buscar horarios por día (similar a findAllByDia, posiblemente redundante)
async findByDia(dia: DiaSemana): Promise<Horario[]> {
  return this.horarioRepository.find({ where: { dia } });
}

// Crear un nuevo horario
async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
  const { id_lugar, ...rest } = createHorarioDto;

  // Crear instancia de horario sin el lugar
  const horario = this.horarioRepository.create(rest);

  // Asignar el lugar usando solo el ID
  horario.lugar = { id_lugar } as LugaresEntity;

  // Guardar en la base de datos
  return this.horarioRepository.save(horario);
}

// Actualizar un horario existente
async update(id: number, updateHorarioDto: Partial<CreateHorarioDto>): Promise<Horario> {
  // Buscar el horario con su relación lugar
  const horario = await this.horarioRepository.findOne({ where: { id }, relations: ['lugar'] });
  if (!horario) throw new NotFoundException('Horario no encontrado');

  // Copiar propiedades actualizadas al objeto encontrado
  Object.assign(horario, updateHorarioDto);

  // Si se envió un nuevo lugar, actualizarlo
  if (updateHorarioDto.id_lugar) {
    horario.lugar = { id_lugar: updateHorarioDto.id_lugar } as LugaresEntity;
  }

  // Guardar cambios en la base de datos
  return this.horarioRepository.save(horario);
}

// Eliminar un horario por ID
async delete(id: number): Promise<void> {
  const result = await this.horarioRepository.delete(id);
  if (result.affected === 0) throw new NotFoundException('Horario no encontrado');
}

// Buscar horarios por día junto con el lugar asociado
async findByDiaConLugar(dia: DiaSemana): Promise<Horario[]> {
  return await this.horarioRepository.find({
    where: { dia },
    relations: ['lugar'],
  });
}





// Obtener todos los horarios de un lugar específico
async getHorariosPorLugar(id_lugar: number): Promise<Horario[]> {
  return this.horarioRepository.find({
    where: { lugar: { id_lugar } }, // Filtra por el ID del lugar
    relations: ['lugar'],           // Incluye información del lugar
  });
}

// Obtener horarios filtrados por lugar y día
async findByLugarYDia(id_lugar: number, dia: DiaSemana): Promise<Horario[]> {
  return this.horarioRepository.find({
    where: { 
      lugar: { id_lugar }, // Filtra por ID del lugar
      dia                  // Filtra por día de la semana
    },
    relations: ['lugar'],  // Incluye información del lugar
  });
}



}
