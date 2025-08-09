import { DetalleFactura } from 'src/admin/detalles-factura/entities/detalles-factura.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('platos')
export class PlatoEntity {
  @PrimaryGeneratedColumn()
  id_plato: number;

  @Column()
  nombre: string;

  @Column('numeric', { precision: 6, scale: 2 })
  precio: number;

  @Column('varchar', { length: 320 })
  descripcion: string;

  @Column('text')
  imagen: string; // URL de la imagen

  @OneToMany(() => DetalleFactura, (detalle) => detalle.plato)
detalles: DetalleFactura[];

}
