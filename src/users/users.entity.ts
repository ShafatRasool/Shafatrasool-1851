import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from '../brands/brand.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  BRAND = 'BRAND',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @ManyToOne(() => Brand, brand => brand.users, { nullable: true })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

}
