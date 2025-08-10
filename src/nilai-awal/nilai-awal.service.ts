import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NilaiAwal } from './entity/nilai-awal.entity';
import { CreateNilaiAwalDto } from './dto/create-nilai-awal.dto';
import { UpdateNilaiAwalDto } from './dto/update-nilai-awal.dto';
import { DimsumVariant } from '../dimsum-variant/entity/dimsum-variant.entity';
import { CriteriaWeight } from '../criteria-weight/entity/criteria-weight.entity';

@Injectable()
export class NilaiAwalService {
    constructor(
        @InjectRepository(NilaiAwal)
        private readonly nilaiAwalRepository: Repository<NilaiAwal>,

        @InjectRepository(DimsumVariant)
        private readonly dimsumVariantRepository: Repository<DimsumVariant>,

        @InjectRepository(CriteriaWeight)
        private readonly criteriaWeightRepository: Repository<CriteriaWeight>,
    ) { }

    async findOriginal() {
        return this.nilaiAwalRepository.query(`
        SELECT 
            na.id_nilai,
            dv.name AS nama_produk,
            cw.criteria_name AS nama_kriteria,
            na.nilai AS nilai
        FROM nilai_awal na
        INNER JOIN dimsum_variants dv ON na.id_produk = dv.id
        INNER JOIN criteria_weight cw ON na.id_kriteria = cw.id
        ORDER BY dv.name, cw.criteria_name
        `);
    }

    async findAll(): Promise<any[]> {
        const allNilai = await this.nilaiAwalRepository.find({ relations: ['produk', 'kriteria'] });

        // Group by produk.id
        const grouped = new Map<number, any>();

        for (const item of allNilai) {
            const produkId = item.produk.id;
            if (!grouped.has(produkId)) {
                grouped.set(produkId, {
                    kode_dimsum: item.produk.id,
                    nama_dimsum: item.produk.name,
                    jumlah_penjualan: null,
                    jumlah_profit: null,
                    profit_pcs: null,
                    other_criteria: {},
                });
            }
            const group = grouped.get(produkId);

            if (item.kriteria.id === 1) {
                group.jumlah_penjualan = item.nilai;
            } else if (item.kriteria.id === 2) {
                group.jumlah_profit = item.nilai;
            } else if (item.kriteria.id === 3) {
                group.profit_pcs = item.nilai;
            } else {
                group.other_criteria[item.kriteria.criteria_name] = item.nilai;
            }
        }

        return Array.from(grouped.values());
    }

    async findOne(id: number): Promise<NilaiAwal> {
        const nilai = await this.nilaiAwalRepository.findOne({
            where: { id_nilai: id },
            relations: ['produk', 'kriteria'],
        });
        if (!nilai) {
            throw new NotFoundException(`NilaiAwal with id ${id} not found`);
        }
        return nilai;
    }

    async create(createNilaiAwalDto: CreateNilaiAwalDto): Promise<NilaiAwal> {
        const produk = await this.dimsumVariantRepository.findOneBy({ id: createNilaiAwalDto.id_produk });
        if (!produk) {
            throw new NotFoundException(`DimsumVariant with id ${createNilaiAwalDto.id_produk} not found`);
        }

        const kriteria = await this.criteriaWeightRepository.findOneBy({ id: createNilaiAwalDto.id_kriteria });
        if (!kriteria) {
            throw new NotFoundException(`CriteriaWeight with id ${createNilaiAwalDto.id_kriteria} not found`);
        }

        // Check if record exists for id_produk and id_kriteria
        let nilai = await this.nilaiAwalRepository.findOne({
            where: {
                produk: { id: createNilaiAwalDto.id_produk },
                kriteria: { id: createNilaiAwalDto.id_kriteria },
            },
            relations: ['produk', 'kriteria'],
        });

        if (nilai) {
            // Update existing record
            nilai.nilai = createNilaiAwalDto.nilai;
        } else {
            // Create new record
            nilai = this.nilaiAwalRepository.create({
                produk,
                kriteria,
                nilai: createNilaiAwalDto.nilai,
            });
        }
        const savedNilai = await this.nilaiAwalRepository.save(nilai);

        // Special logic for id_kriteria = 1 (jumlah_penjualan)
        if (createNilaiAwalDto.id_kriteria === 1) {
            // Insert or update id_kriteria = 2 with nilai = jumlah_penjualan * profit
            const kriteria2 = await this.criteriaWeightRepository.findOneBy({ id: 2 });
            if (!kriteria2) {
                throw new NotFoundException(`CriteriaWeight with id 2 not found`);
            }
            let nilai2 = await this.nilaiAwalRepository.findOne({
                where: {
                    produk: { id: createNilaiAwalDto.id_produk },
                    kriteria: { id: 2 },
                },
                relations: ['produk', 'kriteria'],
            });
            if (nilai2) {
                nilai2.nilai = createNilaiAwalDto.nilai * produk.profit;
            } else {
                nilai2 = this.nilaiAwalRepository.create({
                    produk,
                    kriteria: kriteria2,
                    nilai: createNilaiAwalDto.nilai * produk.profit,
                });
            }
            await this.nilaiAwalRepository.save(nilai2);

            // Insert or update id_kriteria = 3 with nilai = profit
            const kriteria3 = await this.criteriaWeightRepository.findOneBy({ id: 3 });
            if (!kriteria3) {
                throw new NotFoundException(`CriteriaWeight with id 3 not found`);
            }
            let nilai3 = await this.nilaiAwalRepository.findOne({
                where: {
                    produk: { id: createNilaiAwalDto.id_produk },
                    kriteria: { id: 3 },
                },
                relations: ['produk', 'kriteria'],
            });
            if (nilai3) {
                nilai3.nilai = produk.profit;
            } else {
                nilai3 = this.nilaiAwalRepository.create({
                    produk,
                    kriteria: kriteria3,
                    nilai: produk.profit,
                });
            }
            await this.nilaiAwalRepository.save(nilai3);
        }

        return savedNilai;
    }

    async update(id: number, updateNilaiAwalDto: UpdateNilaiAwalDto): Promise<NilaiAwal> {
        const nilai = await this.findOne(id);

        if (updateNilaiAwalDto.id_produk) {
            const produk = await this.dimsumVariantRepository.findOneBy({ id: updateNilaiAwalDto.id_produk });
            if (!produk) {
                throw new NotFoundException(`DimsumVariant with id ${updateNilaiAwalDto.id_produk} not found`);
            }
            nilai.produk = produk;
        }

        if (updateNilaiAwalDto.id_kriteria) {
            const kriteria = await this.criteriaWeightRepository.findOneBy({ id: updateNilaiAwalDto.id_kriteria });
            if (!kriteria) {
                throw new NotFoundException(`CriteriaWeight with id ${updateNilaiAwalDto.id_kriteria} not found`);
            }
            nilai.kriteria = kriteria;
        }

        if (updateNilaiAwalDto.nilai !== undefined) {
            nilai.nilai = updateNilaiAwalDto.nilai;
        }

        return this.nilaiAwalRepository.save(nilai);
    }

    async delete(id: number): Promise<void> {
        const result = await this.nilaiAwalRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`NilaiAwal with id ${id} not found`);
        }
    }

    async normalisasiSAW(): Promise<any[]> {
        // Get all nilai awal grouped by produk
        const data = await this.findAll();

        // Ambil semua nama kriteria
        const criteriaKeys = new Set<string>();
        data.forEach(item => {
            if (item.jumlah_penjualan !== null) criteriaKeys.add('jumlah_penjualan');
            if (item.jumlah_profit !== null) criteriaKeys.add('jumlah_profit');
            if (item.profit_pcs !== null) criteriaKeys.add('profit_pcs');
            Object.keys(item.other_criteria).forEach(k => criteriaKeys.add(k));
        });

        // Cari nilai max tiap kriteria
        const maxValues = new Map<string, number>();
        criteriaKeys.forEach(key => {
            const max = Math.max(...data.map(item => {
                if (key === 'jumlah_penjualan') return item.jumlah_penjualan ?? 0;
                if (key === 'jumlah_profit') return item.jumlah_profit ?? 0;
                if (key === 'profit_pcs') return item.profit_pcs ?? 0;
                return item.other_criteria[key] ?? 0;
            }));
            maxValues.set(key, max);
        });

        // Normalisasi TANPA bobot (0–1)
        const normalizedData = data.map(item => {
            const normalizedItem: any = { nama: item.nama_dimsum };
            criteriaKeys.forEach(key => {
                let val = 0;
                if (key === 'jumlah_penjualan') val = item.jumlah_penjualan ?? 0;
                else if (key === 'jumlah_profit') val = item.jumlah_profit ?? 0;
                else if (key === 'profit_pcs') val = item.profit_pcs ?? 0;
                else val = item.other_criteria[key] ?? 0;

                const max = maxValues.get(key) || 1;
                normalizedItem[key] = max === 0 ? 0 : parseFloat((val / max).toFixed(6));
            });
            return normalizedItem;
        });

        return normalizedData;
    }

    async calculateSAWResult(): Promise<any[]> {
        const normalizedData = await this.normalisasiSAW();

        // Ambil semua nama kriteria
        const criteriaKeys = Object.keys(normalizedData[0] || {}).filter(k => k !== 'nama');

        // Ambil bobot
        const criteriaWeights = await this.criteriaWeightRepository.find();
        const weightMap = new Map<string, number>();
        criteriaWeights.forEach(cw => {
            weightMap.set(cw.criteria_name, cw.weight);
        });

        // Hitung skor akhir
        const result = normalizedData.map(item => {
            let totalScore = 0;
            criteriaKeys.forEach(key => {
                const weight = weightMap.get(key) ?? 0;
                totalScore += (item[key] ?? 0) * weight;
            });
            return {
                nama: item.nama,
                nilai: parseFloat(totalScore.toFixed(6)),
            };
        });

        return result;
    }

}
