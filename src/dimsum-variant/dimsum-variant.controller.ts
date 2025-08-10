import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Put,
    Delete,
    NotFoundException,
} from '@nestjs/common';
import { DimsumVariantService } from './dimsum-variant.service';
import { CreateDimsumVariantDto } from './dto/create-dimsum-variant.dto';
import { UpdateDimsumVariantDto } from './dto/update-dimsum-variant.dto';

@Controller('dimsum-variant')
export class DimsumVariantController {
    constructor(private readonly dimsumVariantService: DimsumVariantService) { }

    @Get()
    async getAll() {
        return this.dimsumVariantService.findAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        const variant = await this.dimsumVariantService.findOne(id);
        if (!variant) {
            throw new NotFoundException(`DimsumVariant with id ${id} not found`);
        }
        return variant;
    }

    @Post()
    async create(@Body() createDimsumVariantDto: CreateDimsumVariantDto) {
        return this.dimsumVariantService.create(createDimsumVariantDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDimsumVariantDto: UpdateDimsumVariantDto,
    ) {
        try {
            return await this.dimsumVariantService.update(id, updateDimsumVariantDto);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.dimsumVariantService.delete(id);
            return { message: `DimsumVariant with id ${id} deleted successfully` };
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
