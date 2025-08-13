import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin', schema: 'admin' })
export class Admin {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  cedula: number;

  @Column({ unique: true, nullable: true })
  correo: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @Column({ default: 'admin' })
  role: string;
}
