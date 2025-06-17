import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CriteriaWeight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  criteria_name: string;

  @Column('float')
  weight: number;
}
