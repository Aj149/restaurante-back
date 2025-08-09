import { Factura } from 'src/admin/factura/entities/factura.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users', schema: 'usuarios' }) 
export class UserEntity {

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

  @OneToMany(() => Factura, (factura) => factura.usuario)
facturas: Factura[];

}
