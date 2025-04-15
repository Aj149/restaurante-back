import { Module } from '@nestjs/common';
import { LugaresService } from './lugares.service';
import { LugaresController } from './lugares.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LugaresEntity } from './entities/lugare.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LugaresEntity])],
  controllers: [LugaresController],
  providers: [LugaresService],
})
export class LugaresModule {}
