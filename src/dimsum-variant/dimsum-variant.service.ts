import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimsumVariant } from './entity/dimsum-variant.entity';
import { CreateDimsumVariantDto } from './dto/create-dimsum-variant.dto';
import { UpdateDimsumVariantDto } from './dto/update-dimsum-variant.dto';

@Injectable()
export class DimsumVariantService {
    constructor(
        @InjectRepository(DimsumVariant)
        private readonly dimsumVariantRepository: Repository<DimsumVariant>,
    ) { }

    async findAll(): Promise<DimsumVariant[]> {
        return this.dimsumVariantRepository.find();
    }

    async findOne(id: number): Promise<DimsumVariant> {
        const variant = await this.dimsumVariantRepository.findOneBy({ id });
        if (!variant) {
            throw new NotFoundException(`DimsumVariant with id ${id} not found`);
        }
        return variant;
    }

    async create(createDimsumVariantDto: CreateDimsumVariantDto): Promise<DimsumVariant> {
        const variant = this.dimsumVariantRepository.create(createDimsumVariantDto);
        return this.dimsumVariantRepository.save(variant);
    }

    async update(id: number, updateDimsumVariantDto: UpdateDimsumVariantDto): Promise<DimsumVariant> {
        const variant = await this.findOne(id);
        Object.assign(variant, updateDimsumVariantDto);
        return this.dimsumVariantRepository.save(variant);
    }

    async delete(id: number): Promise<void> {
        const result = await this.dimsumVariantRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`DimsumVariant with id ${id} not found`);
        }
    }
}
