import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriteriaWeight } from './entity/criteria-weight.entity';
import { CreateCriteriaWeightDto } from './dto/create-criteria-weight.dto';
import { UpdateCriteriaWeightDto } from './dto/update-criteria-weight.dto';

@Injectable()
export class CriteriaWeightService {
  constructor(
    @InjectRepository(CriteriaWeight)
    private criteriaWeightRepository: Repository<CriteriaWeight>,
  ) { }

  findAll(): Promise<CriteriaWeight[]> {
    return this.criteriaWeightRepository.find();
  }

  findOne(id: number): Promise<CriteriaWeight | null> {
    return this.criteriaWeightRepository.findOneBy({ id });
  }

  async create(
    createCriteriaWeightDto: CreateCriteriaWeightDto,
  ): Promise<CriteriaWeight> {
    const totalWeight = await this.criteriaWeightRepository
      .createQueryBuilder()
      .select('SUM(weight)', 'sum')
      .getRawOne();

    const weight = createCriteriaWeightDto.weight;

    if (weight == 0) {
      throw new BadRequestException('Weight cannot be zero');
    }
    const currentSum = totalWeight?.sum ? parseFloat(totalWeight.sum) : 0;
    if (currentSum + createCriteriaWeightDto.weight > 1) {
      throw new BadRequestException('Total weight cannot more than 1');
    }

    const criteriaWeight = this.criteriaWeightRepository.create(
      createCriteriaWeightDto,
    );
    try {
      return await this.criteriaWeightRepository.save(criteriaWeight);
    } catch (error) {
      console.error('Error saving criteria weight:', error);
      throw new BadRequestException('Failed to create criteria weight');
    }
  }

  async update(
    id: number,
    updateCriteriaWeightDto: UpdateCriteriaWeightDto,
  ): Promise<CriteriaWeight> {
    const criteriaWeight = await this.criteriaWeightRepository.preload({
      id: id,
      ...updateCriteriaWeightDto,
    });
    if (!criteriaWeight) {
      throw new BadRequestException(`CriteriaWeight with id ${id} not found`);
    }
    return this.criteriaWeightRepository.save(criteriaWeight);
  }

  async delete(id: number): Promise<void> {
    const result = await this.criteriaWeightRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`CriteriaWeight with id ${id} not found`);
    }
  }
}
