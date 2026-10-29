import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { EncuestaController } from './encuesta.controller';
import { EncuestaService } from './encuesta.service';

describe('POST /api/encuestas', () => {
  let app: INestApplication<App>;
  const create = jest.fn().mockResolvedValue({ ok: true });
  const resultados = jest
    .fn()
    .mockResolvedValue({ total: 217, comentarios: 56 });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [EncuestaController],
      providers: [
        { provide: EncuestaService, useValue: { create, resultados } },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => app.close());
  beforeEach(() => create.mockClear());

  const valid = {
    emociones: ['acompañada'],
    otraEmocion: null,
    nivelIdentificacion: 4,
    impactoAutopercepcion: 'un_poco',
    deseaMasIniciativas: 'si',
    comentario: 'Gracias',
    consentimiento: true,
    website: '',
  };

  it('cierra la encuesta incluso para una respuesta válida', async () => {
    await request(app.getHttpServer())
      .post('/api/encuestas')
      .send(valid)
      .expect(410);
    expect(create).not.toHaveBeenCalled();
  });

  it('cierra la encuesta incluso si el cuerpo está incompleto', async () => {
    await request(app.getHttpServer())
      .post('/api/encuestas')
      .send({ ...valid, consentimiento: false })
      .expect(410);
    expect(create).not.toHaveBeenCalled();
  });

  it('publica el resumen agregado sin autenticación', async () => {
    await request(app.getHttpServer())
      .get('/api/encuestas/resultados')
      .expect(200)
      .expect({ total: 217, comentarios: 56 });
    expect(resultados).toHaveBeenCalledTimes(1);
  });
});
