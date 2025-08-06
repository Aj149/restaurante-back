import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservaEntity } from './reserva.entity';
import { Repository } from 'typeorm';

import { CreateReservaDto } from './dto/reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Horario } from 'src/admin/horario/entities/horario.entity';
import { LugaresEntity } from 'src/admin/lugares/entities/lugare.entity';

@Injectable()
export class ReservaService {

    constructor(
        @InjectRepository(ReservaEntity) 
        private readonly reservaRepository: Repository<ReservaEntity>,
         @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(LugaresEntity)
    private lugarRepository: Repository<LugaresEntity>,
    ) { }

    async getReserva(): Promise<ReservaEntity[]> {
        const list = await this.reservaRepository.find({ relations: ['lugar', 'horario'] });
        if (!list.length) {
            throw new NotFoundException({ message: 'no hay reservas' });
        }
        return list;
    }

    async findById(id_reserva: number): Promise<ReservaEntity> {
        const reserva = await this.reservaRepository.findOne({
            where: { id_reserva },
            relations: ['lugar', 'horario'],
        });
        if (!reserva) {
            throw new NotFoundException({ message: 'esta reserva no existe' });
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

    async createReserva(createReservaDto: CreateReservaDto) {
  const { lugar_id, horario_id, fecha, n_personas, nombre, email, telefono, detalles } = createReservaDto;

  // validar lugar
  const lugar = await this.lugarRepository.findOne({ where: { id_lugar: lugar_id } });
  if (!lugar) throw new NotFoundException('Lugar no encontrado');

  // validar horario y pertenencia EN UNA SOLA CONSULTA (trae la relación lugar)
  const horario = await this.horarioRepository.findOne({
    where: { id: horario_id, lugar: { id_lugar: lugar_id } },
    relations: ['lugar'],
  });
  if (!horario) {
    throw new BadRequestException('Horario inválido o no pertenece al lugar seleccionado');
  }

  // verificar capacidad (asegúrate que lugar.capacidad sea number en la entidad)
  if (typeof lugar.capacidad !== 'undefined' && Number(n_personas) > Number(lugar.capacidad)) {
    throw new BadRequestException(`La capacidad máxima es ${lugar.capacidad}`);
  }

  // verificar si ya existe reserva para lugar+fecha+horario
  const ocupada = await this.reservaRepository.findOne({
    where: {
      lugar: { id_lugar: lugar_id },
      fecha,
      horario: { id: horario_id },
    },
    relations: ['lugar', 'horario'],
  });

  if (ocupada) {
    throw new ConflictException('El horario ya está reservado para esa fecha');
  }

  // crear reserva (asignando relaciones por id)
  const reserva = this.reservaRepository.create({
    nombre,
    email,
    telefono,
    n_personas,
    fecha,
    detalles,
    lugar: { id_lugar: lugar_id } as any,
    horario: { id: horario_id } as any,
  });

  await this.reservaRepository.save(reserva);
  return { message: `La reserva para ${reserva.nombre} ha sido creada` };
}

    async findReservasByLugarAndFecha(lugarId: number, fecha: string) {
        return await this.reservaRepository.find({
            where: { lugar: { id_lugar: lugarId }, fecha },
            relations: ['horario', 'lugar'],
        });
    }

    async getHorariosDisponibles(lugarId: number, fecha: string) {
        // horarios del lugar (activos)
        const horariosLugar = await this.horarioRepository.find({
  where: {
    lugar: { id_lugar: lugarId },
    estado: 'Disponible'  // o el valor que uses para "activo"
  },
  relations: ['lugar'], // si necesitas los datos del lugar, opcional
});



        // reservas ocupadas para ese lugar+fecha
        const reservas = await this.findReservasByLugarAndFecha(lugarId, fecha);
        const horariosOcupadosIds = reservas.map(r => r.horario?.id).filter(Boolean);

        // filtrar
        const disponibles = horariosLugar.filter(h => !horariosOcupadosIds.includes(h.id));
        return disponibles;
    }

    async updateReserva(id_reserva: number, updateReservaDto: any) {
        const reserva = await this.findById(id_reserva);
        Object.assign(reserva, updateReservaDto);
        await this.reservaRepository.save(reserva);
        return { message: `reserva con ID ${reserva.id_reserva} actualizado` };
    }


    async deleteReserva(id_reserva: number) {
        const reserva = await this.findById(id_reserva);
        await this.reservaRepository.delete(reserva.id_reserva);
        return { message: `Reserva con ID ${reserva.id_reserva} eliminada` };
    }



}