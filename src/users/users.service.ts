import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
