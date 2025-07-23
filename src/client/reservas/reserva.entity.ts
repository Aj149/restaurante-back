import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reserva' })
export class ReservaEntity {
  @PrimaryGeneratedColumn('increment')
  id_reserva: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar'})
  email: string;

  @Column({ type: 'int'}) 
  telefono: number;

  @Column({ type: 'varchar' })
  lugar: string;

  @Column({ type: 'int'}) 
  n_personas: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar' })
    hora: string;
 
   @Column({ type: 'varchar', nullable: true })
detalles: string;

}
