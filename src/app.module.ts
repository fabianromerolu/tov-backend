// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { PredictionModule } from './prediction/prediction.module';
import { EncuestaModule } from './encuesta/encuesta.module';
import { BuzonModule } from './buzon/buzon.module';

@Module({
  imports: [
    PrismaModule,
    ContactModule,
    PredictionModule,
    EncuestaModule,
    BuzonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
