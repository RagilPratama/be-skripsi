import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dimsum_variants')
export class DimsumVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('int')
    modal: number;

    @Column('int')
    profit: number;
}
