import { PartialType } from '@nestjs/swagger';
import { CreateCriteriaWeightDto } from './create-criteria-weight.dto';

export class UpdateCriteriaWeightDto extends PartialType(
  CreateCriteriaWeightDto,
) {}
