import { PartialType } from '@nestjs/mapped-types';
import { CreateDimsumVariantDto } from './create-dimsum-variant.dto';

export class UpdateDimsumVariantDto extends PartialType(CreateDimsumVariantDto) { }
