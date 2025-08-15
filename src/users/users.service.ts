import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { Brand } from '../brands/brand.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>, // <-- inject Brand repository
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    brandId?: number, // <-- optional brandId
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (brandId) {
      const brand = await this.brandRepository.findOne({ where: { id: brandId } });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      user.brand = brand; // assign brand
    }

    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
