// detalle-factura.entity.ts
import { Factura } from 'src/admin/factura/entities/factura.entity';
import { PlatoEntity } from 'src/admin/platos/entities/plato.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('detalle_factura')
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @ManyToOne(() => Factura, (factura) => factura.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'factura_id' })
  factura: Factura;

  @ManyToOne(() => PlatoEntity, { eager: true })
  @JoinColumn({ name: 'plato_id' })
  plato: PlatoEntity;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio_unitario: number;
}
