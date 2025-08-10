import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DimsumVariant } from '../../dimsum-variant/entity/dimsum-variant.entity';
import { CriteriaWeight } from '../../criteria-weight/entity/criteria-weight.entity';

@Entity('nilai_awal')
export class NilaiAwal {
    @PrimaryGeneratedColumn({ name: 'id_nilai' })
    id_nilai: number;

    @ManyToOne(() => DimsumVariant, { nullable: false })
    @JoinColumn({ name: 'id_produk' })
    produk: DimsumVariant;

    @ManyToOne(() => CriteriaWeight, { nullable: false })
    @JoinColumn({ name: 'id_kriteria' })
    kriteria: CriteriaWeight;

    @Column('decimal', { precision: 12, scale: 2 })
    nilai: number;
}
