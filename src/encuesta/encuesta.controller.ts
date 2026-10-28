import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { EncuestaService } from './encuesta.service';

@Controller('api/encuestas')
export class EncuestaController {
  constructor(private readonly encuesta: EncuestaService) {}

  @Post()
  create(@Body() dto: CreateEncuestaDto): Promise<{ ok: true }> {
    return this.encuesta.create(dto);
  }

  @Get('resultados')
  @Header('Cache-Control', 'public, max-age=60')
  resultados() {
    return this.encuesta.resultados();
  }
}
