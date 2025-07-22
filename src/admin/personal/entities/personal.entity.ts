export class Personal {}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('personal')
export class PersonalEntity {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  @Column()
  cedula: string;

  @Column()
  nacionalidad: string;

  @Column({ nullable: true })
  imagen: string;

  @Column()
  puesto: string;

  @Column({ type: 'date' })
  fecha_contratacion: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string;

  @Column('decimal', { precision: 10, scale: 2 }) // ejemplo: 1500.00
  salario: number;

  @Column({ nullable: true })
  genero: string;

  @Column({ nullable: true })
  jornadaLaboral: string;
}
