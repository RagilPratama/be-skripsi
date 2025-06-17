import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCriteriaWeightDto {
  @ApiProperty({ description: 'Name of the criteria' })
  @IsNotEmpty()
  criteria_name: string;

  @ApiProperty({ description: 'Weight of the criteria' })
  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
