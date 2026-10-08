import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { EncuestaController } from './encuesta.controller';
import { EncuestaService } from './encuesta.service';

describe('POST /api/encuestas', () => {
  let app: INestApplication<App>;
  const create = jest.fn().mockResolvedValue({ ok: true });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [EncuestaController],
      providers: [{ provide: EncuestaService, useValue: { create } }],
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

  it('acepta una respuesta y no expone identificadores', async () => {
    await request(app.getHttpServer())
      .post('/api/encuestas')
      .send(valid)
      .expect(201)
      .expect({ ok: true });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('rechaza respuestas sin consentimiento antes del servicio', async () => {
    await request(app.getHttpServer())
      .post('/api/encuestas')
      .send({ ...valid, consentimiento: false })
      .expect(400);
    expect(create).not.toHaveBeenCalled();
  });
});
