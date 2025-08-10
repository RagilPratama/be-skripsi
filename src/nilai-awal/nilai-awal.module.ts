import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NilaiAwal } from './entity/nilai-awal.entity';
import { NilaiAwalService } from './nilai-awal.service';
import { NilaiAwalController } from './nilai-awal.controller';
import { DimsumVariant } from '../dimsum-variant/entity/dimsum-variant.entity';
import { CriteriaWeight } from '../criteria-weight/entity/criteria-weight.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NilaiAwal, DimsumVariant, CriteriaWeight])],
    providers: [NilaiAwalService],
    controllers: [NilaiAwalController],
    exports: [NilaiAwalService],
})
export class NilaiAwalModule { }
