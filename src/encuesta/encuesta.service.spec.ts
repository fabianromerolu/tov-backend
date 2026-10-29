import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { EncuestaService } from './encuesta.service';

const validResponse: CreateEncuestaDto = {
  emociones: ['acompañada', 'otra'],
  otraEmocion: 'Esperanzada',
  nivelIdentificacion: 4,
  impactoAutopercepcion: 'un_poco',
  deseaMasIniciativas: 'si',
  comentario: 'Me sentí escuchada.',
  consentimiento: true,
  website: '',
};

describe('EncuestaService', () => {
  const create = jest.fn();
  const findMany = jest.fn();
  const count = jest.fn();
  const service = new EncuestaService({
    encuesta: { create, findMany, count },
  } as unknown as PrismaService);

  beforeEach(() => {
    create.mockReset();
    findMany.mockReset();
    count.mockReset();
  });

  it('publica solo agregados de respuestas de la semana del reparto', async () => {
    findMany.mockResolvedValue([
      {
        emociones: ['valorada'],
        nivelIdentificacion: 5,
        impactoAutopercepcion: 'si',
        deseaMasIniciativas: 'si',
        createdAt: new Date('2026-10-26T23:00:00Z'),
        comentario: 'Texto que no debe salir',
      },
    ]);
    count.mockResolvedValue(1);

    const resultado = await service.resultados();
    expect(findMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: new Date('2026-10-26T05:00:00Z'),
          lt: new Date('2026-11-02T05:00:00Z'),
        },
      },
      select: {
        emociones: true,
        nivelIdentificacion: true,
        impactoAutopercepcion: true,
        deseaMasIniciativas: true,
        createdAt: true,
      },
    });
    expect(resultado.total).toBe(1);
    expect(resultado.comentarios).toBe(1);
    expect(count).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: new Date('2026-10-26T05:00:00Z'),
          lt: new Date('2026-11-02T05:00:00Z'),
        },
        comentario: { not: null },
      },
    });
    expect(JSON.stringify(resultado)).not.toContain('Texto que no debe salir');
  });

  it('guarda texto limpio sin datos de la solicitud y responde sin id', async () => {
    create.mockResolvedValue({ id: 42 });
    await expect(
      service.create({
        ...validResponse,
        comentario: ' <b>Me sentí escuchada.</b>\n',
      }),
    ).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith({
      data: {
        emociones: ['acompañada', 'otra'],
        otraEmocion: 'Esperanzada',
        nivelIdentificacion: 4,
        impactoAutopercepcion: 'un_poco',
        deseaMasIniciativas: 'si',
        comentario: 'Me sentí escuchada.',
        consentimiento: true,
      },
    });
  });

  it('descarta el honeypot sin guardar', async () => {
    await expect(
      service.create({ ...validResponse, website: 'spam' }),
    ).resolves.toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
  });

  it('rechaza datos identificables en la respuesta abierta', async () => {
    await expect(
      service.create({
        ...validResponse,
        comentario: 'Escríbeme a yo@ejemplo.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });
});
