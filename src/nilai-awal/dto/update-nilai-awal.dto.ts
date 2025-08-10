import { PartialType } from '@nestjs/mapped-types';
import { CreateNilaiAwalDto } from './create-nilai-awal.dto';

export class UpdateNilaiAwalDto extends PartialType(CreateNilaiAwalDto) { }
