import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  agregarResultados,
  FIN_SEMANA_ENTREGAS,
  INICIO_ENTREGAS,
  ResultadosEncuesta,
} from './encuesta-resultados';

@Injectable()
export class EncuestaService {
  constructor(private readonly prisma: PrismaService) {}

  async resultados(): Promise<ResultadosEncuesta> {
    const semana = {
      createdAt: { gte: INICIO_ENTREGAS, lt: FIN_SEMANA_ENTREGAS },
    };
    const [respuestas, comentarios] = await Promise.all([
      this.prisma.encuesta.findMany({
        where: semana,
        select: {
          emociones: true,
          nivelIdentificacion: true,
          impactoAutopercepcion: true,
          deseaMasIniciativas: true,
          createdAt: true,
        },
      }),
      this.prisma.encuesta.count({
        where: { ...semana, comentario: { not: null } },
      }),
    ]);

    // La API pública entrega solo agregados; nunca envía comentarios ni filas.
    return agregarResultados(respuestas, comentarios);
  }
}
