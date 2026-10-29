import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import {
  agregarResultados,
  FIN_SEMANA_ENTREGAS,
  INICIO_ENTREGAS,
  ResultadosEncuesta,
} from './encuesta-resultados';

const PERSONAL_DATA = [
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
  /(?:\+?\d[\d().\s-]{7,}\d)/,
  /\b\d{6,12}\b/,
];

function cleanText(value?: string | null): string | null {
  if (value == null) return null;
  const withoutTags = value.normalize('NFC').replace(/<[^>]*>/g, '');
  return (
    Array.from(withoutTags)
      .map((character) => {
        const code = character.charCodeAt(0);
        return code <= 31 || code === 127 ? ' ' : character;
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim() || null
  );
}

function privateText(value: string | null): boolean {
  return value !== null && PERSONAL_DATA.some((pattern) => pattern.test(value));
}

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

  async create(dto: CreateEncuestaDto): Promise<{ ok: true }> {
    // Responder igual a un bot que completó la trampa, sin guardar su envío.
    if (dto.website?.trim()) return { ok: true };

    const otraEmocion = dto.emociones.includes('otra')
      ? cleanText(dto.otraEmocion)
      : null;
    const comentario = cleanText(dto.comentario);

    if (privateText(otraEmocion) || privateText(comentario)) {
      throw new BadRequestException({
        message:
          'Revisa el texto y retira correos, teléfonos o documentos personales.',
        field: privateText(otraEmocion) ? 'otraEmocion' : 'comentario',
      });
    }

    await this.prisma.encuesta.create({
      data: {
        emociones: dto.emociones,
        otraEmocion,
        nivelIdentificacion: dto.nivelIdentificacion,
        impactoAutopercepcion: dto.impactoAutopercepcion,
        deseaMasIniciativas: dto.deseaMasIniciativas,
        comentario,
        consentimiento: true,
      },
    });

    return { ok: true };
  }
}
