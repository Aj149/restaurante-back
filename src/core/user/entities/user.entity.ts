import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users', schema: 'usuarios' }) 
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ })
  telefono: string;

  @Column({ })
  direccion: string;

@Column({ nullable: true })
resetToken: string;

@Column({ type: 'timestamp', nullable: true })
resetTokenExpires: Date;

  @Column({ default: 'usuario' })
  role: string;  // 'usuario' o 'admin'
}
