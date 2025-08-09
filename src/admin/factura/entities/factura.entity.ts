// factura.entity.ts
import { DetalleFactura } from 'src/admin/detalles-factura/entities/detalles-factura.entity';
import { UserEntity } from 'src/core/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';



@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn()
  id_factura: number;

  @ManyToOne(() => UserEntity, (user) => user.facturas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_final: number;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura, { cascade: true })
  detalles: DetalleFactura[];
}
