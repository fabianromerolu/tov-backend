// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('✔️ Conectado a la base de datos');
        return;
      } catch (err) {
        retries++;
        this.logger.warn(`Base de datos no lista (intento ${retries}/${maxRetries}), reintentando en 5s...`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }

    throw new Error('No se pudo conectar a la base de datos tras múltiples intentos');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

