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

   // Método para obtener todas las reservas almacenadas en la base de datos
async getReserva(): Promise<ReservaEntity[]> {
  // Busca todas las reservas, incluyendo sus relaciones con 'lugar' y 'horario'
  const list = await this.reservaRepository.find({ relations: ['lugar', 'horario'] });

  // Si no existen reservas, lanza una excepción indicando que no hay registros
  if (!list.length) {
    throw new NotFoundException({ message: 'no hay reservas' });
  }

  // Devuelve la lista completa de reservas encontradas
  return list;
}

// Método para buscar una reserva específica por su ID
async findById(id_reserva: number): Promise<ReservaEntity> {
  // Busca una reserva por su ID e incluye la información relacionada de 'lugar' y 'horario'
  const reserva = await this.reservaRepository.findOne({
    where: { id_reserva },
    relations: ['lugar', 'horario'],
  });

  // Si no encuentra ninguna reserva con ese ID, lanza excepción indicando que no existe
  if (!reserva) {
    throw new NotFoundException({ message: 'esta reserva no existe' });
  }

  // Devuelve la reserva encontrada con sus relaciones cargadas
  return reserva;
}

// Método para buscar una reserva por su nombre (campo 'nombre')
async findOneByNombre(nombre: string) {
  // Busca una reserva que coincida exactamente con el nombre dado
  const reserva = await this.reservaRepository.findOne({ where: { nombre } });

  // Si no encuentra ninguna reserva con ese nombre, lanza una excepción
  if (!reserva) {
    throw new NotFoundException({ message: 'No existe la reserva con este nombre' });
  }

  // Devuelve la reserva encontrada
  return reserva;
}


    async createReserva(createReservaDto: CreateReservaDto) {
  // Desestructuramos los datos recibidos para facilitar el acceso
  const { lugar_id, horario_id, fecha, n_personas, nombre, email, telefono, detalles } = createReservaDto;

  // Validar que el lugar exista en la base de datos
  const lugar = await this.lugarRepository.findOne({ where: { id_lugar: lugar_id } });
  if (!lugar) throw new NotFoundException('Lugar no encontrado');

  // Validar que el horario exista y que pertenezca al lugar especificado,
  // usando una sola consulta que también trae la relación con lugar
  const horario = await this.horarioRepository.findOne({
    where: { id: horario_id, lugar: { id_lugar: lugar_id } },
    relations: ['lugar'],
  });
  if (!horario) {
    throw new BadRequestException('Horario inválido o no pertenece al lugar seleccionado');
  }

  // Verificar que la cantidad de personas no supere la capacidad del lugar
  // Se asegura que lugar.capacidad sea numérico para la comparación
  if (typeof lugar.capacidad !== 'undefined' && Number(n_personas) > Number(lugar.capacidad)) {
    throw new BadRequestException(`La capacidad máxima es ${lugar.capacidad}`);
  }

  // Verificar si ya existe una reserva para el mismo lugar, fecha y horario
  // para evitar doble reserva
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

  // Crear la nueva reserva asignando las relaciones por ID (sin cargar entidades completas)
  const reserva = this.reservaRepository.create({
    nombre,
    email,
    telefono,
    n_personas,
    fecha,
    detalles,
    lugar: { id_lugar: lugar_id } as any,  // 'as any' para evitar problemas de tipado
    horario: { id: horario_id } as any,
  });

  // Guardar la reserva en la base de datos
  await this.reservaRepository.save(reserva);

  // Retornar mensaje de éxito
  return { message: `La reserva para ${reserva.nombre} ha sido creada` };
}

// Método para buscar todas las reservas en un lugar y fecha específica
async findReservasByLugarAndFecha(lugarId: number, fecha: string) {
  return await this.reservaRepository.find({
    where: { lugar: { id_lugar: lugarId }, fecha },
    relations: ['horario', 'lugar'],  // Cargar información relacionada para contexto completo
  });
}


    // Método para obtener los horarios disponibles en un lugar para una fecha específica
async getHorariosDisponibles(lugarId: number, fecha: string) {
  // 1. Obtener todos los horarios activos (disponibles) asociados al lugar
  const horariosLugar = await this.horarioRepository.find({
    where: {
      lugar: { id_lugar: lugarId },
      estado: 'Disponible' // Estado que indica que el horario está activo y puede reservarse
    },
    relations: ['lugar'], // Opcional, para obtener detalles del lugar si se requieren
  });

  // 2. Obtener todas las reservas existentes para ese lugar y fecha (horarios ocupados)
  const reservas = await this.findReservasByLugarAndFecha(lugarId, fecha);

  // 3. Extraer los IDs de los horarios que ya están ocupados en esas reservas
  // Se filtran para ignorar valores undefined o nulos
  const horariosOcupadosIds = reservas.map(r => r.horario?.id).filter(Boolean);

  // 4. Filtrar los horarios del lugar excluyendo los que ya están ocupados
  const disponibles = horariosLugar.filter(h => !horariosOcupadosIds.includes(h.id));

  // 5. Devolver la lista de horarios disponibles para reservar
  return disponibles;
}

// Método para actualizar una reserva existente
async updateReserva(id_reserva: number, updateReservaDto: any) {
  // 1. Buscar la reserva por ID para asegurarse que existe
  const reserva = await this.findById(id_reserva);

  // 2. Actualizar los campos de la reserva con los datos recibidos
  Object.assign(reserva, updateReservaDto);

  // 3. Guardar los cambios en la base de datos
  await this.reservaRepository.save(reserva);

  // 4. Retornar mensaje confirmando la actualización
  return { message: `reserva con ID ${reserva.id_reserva} actualizado` };
}

// Método para eliminar una reserva por su ID
async deleteReserva(id_reserva: number) {
  // 1. Buscar la reserva por ID para verificar que existe
  const reserva = await this.findById(id_reserva);

  // 2. Eliminar la reserva encontrada de la base de datos
  await this.reservaRepository.delete(reserva.id_reserva);

  // 3. Retornar mensaje confirmando la eliminación
  return { message: `Reserva con ID ${reserva.id_reserva} eliminada` };
}



}