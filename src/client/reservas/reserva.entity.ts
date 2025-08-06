import { Horario } from 'src/admin/horario/entities/horario.entity';
import { LugaresEntity } from 'src/admin/lugares/entities/lugare.entity';

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reserva' })
export class ReservaEntity {
  @PrimaryGeneratedColumn('increment')
  id_reserva: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  email: string;

  // Mejor como varchar para aceptar ceros, +, guiones, etc.
  @Column({ type: 'varchar' })
  telefono: string;

  // Relación ManyToOne con Lugar (guardará lugar_id en la tabla reserva)
  @ManyToOne(() => LugaresEntity, { eager: true })
  @JoinColumn({ name: 'lugar_id' })
  lugar: LugaresEntity;

  @Column({ type: 'int' })
  n_personas: number;

  @Column({ type: 'date' })
  fecha: string; // puedes usar string o Date según tu preferencia

  @ManyToOne(() => Horario, { eager: true })
  @JoinColumn({ name: 'horario_id' })
  horario: Horario;

  @Column({ type: 'varchar', nullable: true })
  detalles: string;
}
