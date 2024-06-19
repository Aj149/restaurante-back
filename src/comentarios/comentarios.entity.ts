import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from 'class-validator';

@Entity({name: "comentarios"})
export class ComentariosEntity{
    @PrimaryGeneratedColumn()
    id_comentario: number;

    @Column({ type: 'varchar' })
    nombre: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    comentario: string;
}