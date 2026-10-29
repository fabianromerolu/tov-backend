import { Body, Controller, Post } from '@nestjs/common';
import { BuzonService } from './buzon.service';
import { CreateSugerenciaDto } from './dto/create-sugerencia.dto';

@Controller('api/buzon-sugerencias')
export class BuzonController {
  constructor(private readonly buzon: BuzonService) {}

  @Post()
  create(@Body() dto: CreateSugerenciaDto): Promise<{ ok: true }> {
    return this.buzon.create(dto);
  }
}
