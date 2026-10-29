import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { BuzonController } from './buzon.controller';
import { BuzonService } from './buzon.service';

describe('POST /api/buzon-sugerencias', () => {
  let app: INestApplication<App>;
  const create = jest.fn().mockResolvedValue({ ok: true });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [BuzonController],
      providers: [{ provide: BuzonService, useValue: { create } }],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => app.close());
  beforeEach(() => create.mockClear());

  it('acepta un comentario voluntario sin devolver identificadores', async () => {
    await request(app.getHttpServer())
      .post('/api/buzon-sugerencias')
      .send({
        comentario: 'Más actividades como esta',
        consentimiento: true,
        website: '',
      })
      .expect(201)
      .expect({ ok: true });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('rechaza un comentario sin consentimiento o demasiado largo', async () => {
    await request(app.getHttpServer())
      .post('/api/buzon-sugerencias')
      .send({ comentario: 'Sugerencia', consentimiento: false })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/buzon-sugerencias')
      .send({ comentario: 'a'.repeat(501), consentimiento: true })
      .expect(400);
    expect(create).not.toHaveBeenCalled();
  });
});
