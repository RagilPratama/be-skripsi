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
import { NilaiAwalService } from './nilai-awal.service';
import { CreateNilaiAwalDto } from './dto/create-nilai-awal.dto';
import { UpdateNilaiAwalDto } from './dto/update-nilai-awal.dto';

@Controller('nilai-awal')
export class NilaiAwalController {
    constructor(private readonly nilaiAwalService: NilaiAwalService) { }

    @Get()
    async getAll() {
        return this.nilaiAwalService.findAll();
    }

    @Get('original')
    async getOriginal() {
        return this.nilaiAwalService.findOriginal();
    }

    @Get('normalisasi')
    async normalisasi() {
        return this.nilaiAwalService.normalisasiSAW();
    }

    @Get('result-saw')
    async resultSAW() {
        return this.nilaiAwalService.calculateSAWResult();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        const nilai = await this.nilaiAwalService.findOne(id);
        if (!nilai) {
            throw new NotFoundException(`NilaiAwal with id ${id} not found`);
        }
        return nilai;
    }

    @Post()
    async create(@Body() createNilaiAwalDto: CreateNilaiAwalDto) {
        return this.nilaiAwalService.create(createNilaiAwalDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNilaiAwalDto: UpdateNilaiAwalDto,
    ) {
        try {
            return await this.nilaiAwalService.update(id, updateNilaiAwalDto);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.nilaiAwalService.delete(id);
            return { message: `NilaiAwal with id ${id} deleted successfully` };
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

}
