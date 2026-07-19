import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    // Инициализируем пул внутри конструктора
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    // Передаем адаптер в PrismaClient
    super({ adapter });
    
    // Сохраняем ссылку на пул в классе, чтобы потом его закрыть
    this.pool = pool;
  }

  async onModuleInit() {
    // Подключение произойдет автоматически при первом обращении к БД.
    // this.$connect() здесь больше не нужен, поэтому мы его удалили.
  }

  async onModuleDestroy() {
    // Закрываем пул соединений самого драйвера pg
    await this.pool.end();
  }
}