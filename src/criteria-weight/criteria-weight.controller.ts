import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    NotFoundException,
    Put,
    Delete,
} from '@nestjs/common';
import { CriteriaWeightService } from './criteria-weight.service';
import { CreateCriteriaWeightDto } from './dto/create-criteria-weight.dto';
import { UpdateCriteriaWeightDto } from './dto/update-criteria-weight.dto';

@Controller('criteria-weight')
export class CriteriaWeightController {
    constructor(
        private readonly criteriaWeightService: CriteriaWeightService,
    ) {}

    @Get()
    async getAll() {
        return this.criteriaWeightService.findAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        const criteriaWeight = await this.criteriaWeightService.findOne(id);
        if (!criteriaWeight) {
            throw new NotFoundException(
                `CriteriaWeight with id ${id} not found`,
            );
        }
        return criteriaWeight;
    }

    @Post()
    async create(@Body() createCriteriaWeightDto: CreateCriteriaWeightDto) {
        return this.criteriaWeightService.create(createCriteriaWeightDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCriteriaWeightDto: UpdateCriteriaWeightDto,
    ) {
        try {
            return await this.criteriaWeightService.update(
                id,
                updateCriteriaWeightDto,
            );
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.criteriaWeightService.delete(id);
            return {
                message: `CriteriaWeight with id ${id} deleted successfully`,
            };
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
