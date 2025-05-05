import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'admin', schema: 'admin' }) 
export class Admin {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    cedula: string;
  
    @Column()
    password: string; 
}
