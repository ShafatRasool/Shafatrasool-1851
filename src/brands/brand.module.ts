import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { Brand } from './brand.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, User])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
