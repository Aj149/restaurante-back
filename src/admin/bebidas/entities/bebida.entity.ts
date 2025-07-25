import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bebidas')
export class BebidaEntity {

  @PrimaryGeneratedColumn()
  id_bebida: number;

  @Column()
  nombre: string;

  @Column('numeric', { precision: 6, scale: 2 })
  precio: number;

  @Column('varchar', { length: 100 })
  descripcion: string;

  @Column('text')
  imagen: string; // URL de la imagen
}
