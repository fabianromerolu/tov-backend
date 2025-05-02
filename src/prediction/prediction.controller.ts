// src/prediction/prediction.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PredictionService }      from './prediction.service';
import { InputDataDto }           from './dto/input-data.dto';
import { DataServidor }           from './dto/data-servidor.dto';

@Controller('tov-r1')
export class PredictionController {
  constructor(private readonly svc: PredictionService) {}

  @Post()
  async predict(@Body() dto: InputDataDto): Promise<DataServidor> {
    return this.svc.predict(dto);
  }
}
