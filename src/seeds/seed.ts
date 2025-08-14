import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/users.entity'; 
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email: 'admin@example.com' } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = userRepo.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN, 
    });
    await userRepo.save(admin);
    console.log('✅ Admin user seeded.');
  } else {
    console.log('ℹ️ Admin user already exists, skipping.');
  }

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
