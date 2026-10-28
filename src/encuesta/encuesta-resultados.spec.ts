import { agregarResultados, INICIO_ENTREGAS } from './encuesta-resultados';

describe('agregarResultados', () => {
  it('cuenta selecciones múltiples y usa la fecha de Colombia', () => {
    const resultado = agregarResultados(
      [
        {
          emociones: ['valorada', 'acompañada', 'valorada'],
          nivelIdentificacion: 5,
          impactoAutopercepcion: 'si',
          deseaMasIniciativas: 'si',
          createdAt: new Date('2026-10-27T04:59:00.000Z'),
        },
        {
          emociones: ['reflexiva'],
          nivelIdentificacion: 3,
          impactoAutopercepcion: 'un_poco',
          deseaMasIniciativas: 'tal_vez',
          createdAt: new Date('2026-10-27T05:00:00.000Z'),
        },
      ],
      1,
      new Date('2026-10-28T18:00:00.000Z'),
    );

    expect(INICIO_ENTREGAS.toISOString()).toBe('2026-10-26T05:00:00.000Z');
    expect(resultado.total).toBe(2);
    expect(resultado.comentarios).toBe(1);
    expect(resultado.emociones.valorada).toBe(1);
    expect(resultado.emociones.acompañada).toBe(1);
    expect(resultado.identificacion['5']).toBe(1);
    expect(resultado.porDia).toEqual([
      { fecha: '2026-10-26', total: 1 },
      { fecha: '2026-10-27', total: 1 },
    ]);
  });
});
