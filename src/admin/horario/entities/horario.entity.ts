import { DiaSemana } from 'src/admin/lugares/dias.enum';
import { LugaresEntity } from 'src/admin/lugares/entities/lugare.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DiaSemana,
  })
  dia: DiaSemana;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({ type: 'varchar', length: 20 })
  estado: string;  // 'Disponible' o 'Ocupado'

  // Relación ManyToOne con Lugar
  @ManyToOne(() => LugaresEntity, lugar => lugar.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_lugar' }) // columna FK en Horario
  lugar: LugaresEntity;
}
