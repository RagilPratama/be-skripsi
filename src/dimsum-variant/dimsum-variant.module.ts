import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DimsumVariant } from './entity/dimsum-variant.entity';
import { DimsumVariantService } from './dimsum-variant.service';
import { DimsumVariantController } from './dimsum-variant.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DimsumVariant])],
    providers: [DimsumVariantService],
    controllers: [DimsumVariantController],
    exports: [DimsumVariantService],
})
export class DimsumVariantModule { }
