import { PrismaService } from '../prisma/prisma.service';
import { EncuestaService } from './encuesta.service';

describe('EncuestaService', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const service = new EncuestaService({
    encuesta: { findMany, count },
  } as unknown as PrismaService);

  beforeEach(() => {
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
});
