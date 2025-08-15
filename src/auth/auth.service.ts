import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
async signup(
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.BRAND,
  brandId?: number,
) {
  const userExists = await this.usersService.findByEmail(email);
  if (userExists) {
    throw new UnauthorizedException('Email already in use');
  }

  const user = await this.usersService.createUser(name, email, password, role, brandId); 
  const payload = { sub: user.id, email: user.email, role: user.role };

  return {
    message: 'User created successfully',
    access_token: this.jwtService.sign(payload),
  };
}



  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
