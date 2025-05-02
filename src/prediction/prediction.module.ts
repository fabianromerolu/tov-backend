// src/prediction/prediction.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.ML_SERVICE_URL, // ya lo definiste en tu docker-compose
      timeout: 5000,
    }),
  ],
  providers: [PredictionService],
  controllers: [PredictionController],
})
export class PredictionModule {}



