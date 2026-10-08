import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';

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
