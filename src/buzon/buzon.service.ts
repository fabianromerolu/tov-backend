import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSugerenciaDto } from './dto/create-sugerencia.dto';

const PERSONAL_DATA = [
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
  /(?:\+?\d[\d().\s-]{7,}\d)/,
  /\b\d{6,12}\b/,
];

function cleanText(value: string): string {
  const withoutTags = value.normalize('NFC').replace(/<[^>]*>/g, '');
  return Array.from(withoutTags)
    .map((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127 ? ' ' : character;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

@Injectable()
export class BuzonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSugerenciaDto): Promise<{ ok: true }> {
    // El campo trampa se descarta sin insertar una fila.
    if (dto.website?.trim()) return { ok: true };

    const comentario = cleanText(dto.comentario);
    if (!comentario) {
      throw new BadRequestException({
        field: 'comentario',
        message: 'Escribe un comentario antes de enviarlo.',
      });
    }
    if (PERSONAL_DATA.some((pattern) => pattern.test(comentario))) {
      throw new BadRequestException({
        field: 'comentario',
        message: 'Retira correos, teléfonos o documentos personales.',
      });
    }

    await this.prisma.buzonSugerencia.create({ data: { comentario } });
    return { ok: true };
  }
}
