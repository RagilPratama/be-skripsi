import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DimsumVariantModule } from './dimsum-variant/dimsum-variant.module';
import { NilaiAwalModule } from './nilai-awal/nilai-awal.module';

import { CriteriaWeightModule } from './criteria-weight/criteria-weight.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql', // nama service di docker-compose
      port: 3306,
      username: 'root',
      password: 'london213',
      database: 'skripsi',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CriteriaWeightModule,
    DimsumVariantModule,
    NilaiAwalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
