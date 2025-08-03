import { Horario } from 'src/admin/horario/entities/horario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('lugares')
export class LugaresEntity {
  @PrimaryGeneratedColumn()
  id_lugar: number;

  @Column()
  nombre: string;

  @Column('numeric', { precision: 6, scale: 2 })
  precio: number;

  @Column('varchar', { length: 320 })
  descripcion: string;

  @Column('text')
  imagen: string;

  @Column('int')
  capacidad: number;

  @OneToMany(() => Horario, horario => horario.lugar, { cascade: true }) // opcional cascade para que se guarden Horarios junto a Lugar
  horarios: Horario[];
}
