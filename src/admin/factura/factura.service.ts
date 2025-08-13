import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { DetalleFactura } from '../detalles-factura/entities/detalles-factura.entity';
import { UserEntity } from 'src/core/user/entities/user.entity';
import { PlatoEntity } from '../platos/entities/plato.entity';

@Injectable()
export class FacturaService {
   constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,

    @InjectRepository(UserEntity)
    private readonly usuarioRepo: Repository<UserEntity>,

    @InjectRepository(PlatoEntity)
    private readonly platoRepo: Repository<PlatoEntity>,
  ) {}

  
// Método para crear una nueva factura con sus detalles
async create(dto: CreateFacturaDto) {
  // 1️⃣ Verificar que el cliente (usuario) existe
  const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });
  if (!usuario) throw new Error('Cliente no encontrado');

  // 2️⃣ Crear la factura (fecha actual y totales)
  const factura = this.facturaRepo.create({
    usuario,
    fecha: new Date(),
    total: dto.total,
    iva: dto.iva,
    total_final: dto.total_final,
  });
  // Guardar factura en la base de datos
  const facturaGuardada = await this.facturaRepo.save(factura);

  // 3️⃣ Crear cada detalle de la factura
  for (const detalle of dto.detalles) {
    // Verificar que el plato existe
    const plato = await this.platoRepo.findOne({ where: { id_plato: detalle.platoId } });
    if (!plato) throw new Error(`Plato con ID ${detalle.platoId} no encontrado`);

    // Crear el detalle con su cantidad y precio
    const nuevoDetalle = this.detalleRepo.create({
      factura: facturaGuardada,
      plato,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
    });
    // Guardar el detalle en la base de datos
    await this.detalleRepo.save(nuevoDetalle);
  }

  // Retornar la factura completa con sus detalles
  return this.findOne(facturaGuardada.id_factura);
}

// Obtener todas las facturas con relaciones (usuario, detalles y platos)
async findAll() {
  return this.facturaRepo.find({
    relations: ['usuario', 'detalles', 'detalles.plato'],
  });
}

// Obtener una factura por su ID con relaciones
async findOne(id: number) {
  return this.facturaRepo.findOne({
    where: { id_factura: id },
    relations: ['usuario', 'detalles', 'detalles.plato'],
  });
}

// Eliminar una factura por su ID
async remove(id: number) {
  return this.facturaRepo.delete(id);
}

}
