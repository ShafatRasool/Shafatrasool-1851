import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { User } from '../users/users.entity';


@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
      @InjectRepository(User)      // <-- add this
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateBrandDto, adminUser: User) {
    const brand = this.brandRepo.create({ ...dto, createdBy: adminUser });
    return await this.brandRepo.save(brand);
  }

  async update(id: number, dto: UpdateBrandDto) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    Object.assign(brand, dto);
    return await this.brandRepo.save(brand);
  }

  async delete(id: number) {
  const brand = await this.brandRepo.findOne({ 
    where: { id },
    relations: ['users'], // load associated users
  });
  
  if (!brand) throw new NotFoundException('Brand not found');

  // Delete users associated with the brand
  if (brand.users && brand.users.length > 0) {
    await this.userRepo.remove(brand.users);
  }

  // Delete the brand
  await this.brandRepo.remove(brand);

  return { message: 'Brand and associated users deleted successfully' };
}

  async findAll() {
    return await this.brandRepo.find();
  }
}
