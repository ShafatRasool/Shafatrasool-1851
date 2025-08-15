import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from 'src/dto/create-brand.dto';
import { UpdateBrandDto } from 'src/dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/users/users.entity';

@Controller('brands')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateBrandDto, @Req() req) {
    return this.brandService.create(dto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
    return this.brandService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.delete(id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.brandService.findAll();
  }
}
