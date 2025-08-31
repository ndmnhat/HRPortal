import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseTestConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT ?? '5432', 10) || 5432,
  username: process.env.TEST_DB_USERNAME || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
  database: process.env.TEST_DB_NAME || 'hr_portal_test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: false,
  logging: false,
  migrations: [],
  migrationsRun: false,
});