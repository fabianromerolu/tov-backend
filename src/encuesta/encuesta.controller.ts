import { Controller, Get, GoneException, Header, Post } from '@nestjs/common';
import { EncuestaService } from './encuesta.service';

@Controller('api/encuestas')
export class EncuestaController {
  constructor(private readonly encuesta: EncuestaService) {}

  @Post()
  create(): never {
    throw new GoneException('La campaña finalizó y la encuesta está cerrada.');
  }

  @Get('resultados')
  @Header('Cache-Control', 'public, max-age=60')
  resultados() {
    return this.encuesta.resultados();
  }
}
