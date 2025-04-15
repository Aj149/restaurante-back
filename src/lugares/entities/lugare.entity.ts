import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  imagen: string; // URL de la imagen

  @Column('int')
  capacidad: number;
}
