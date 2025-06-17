import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriaWeightController } from './criteria-weight.controller';
import { CriteriaWeightService } from './criteria-weight.service';
import { CriteriaWeight } from './entity/criteria-weight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriteriaWeight])],
  controllers: [CriteriaWeightController],
  providers: [CriteriaWeightService],
})
export class CriteriaWeightModule {}
