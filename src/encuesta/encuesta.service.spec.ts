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
  const service = new EncuestaService({
    encuesta: { create },
  } as unknown as PrismaService);

  beforeEach(() => create.mockReset());

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
