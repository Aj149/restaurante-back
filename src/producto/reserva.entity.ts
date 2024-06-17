import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reserva' })
export class ReservaEntity {
  @PrimaryGeneratedColumn()
  id_reserva: number;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'int', nullable: false }) 
  telefono: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lugar: string;

  @Column({ type: 'int', nullable: false }) 
  n_personas: number;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ type: 'varchar' })
    hora: string;
}
