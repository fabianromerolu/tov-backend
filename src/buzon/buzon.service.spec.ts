import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuzonService } from './buzon.service';

describe('BuzonService', () => {
  const create = jest.fn();
  const service = new BuzonService({
    buzonSugerencia: { create },
  } as unknown as PrismaService);

  beforeEach(() => create.mockReset());

  it('guarda el texto limpio en la tabla separada y no expone un id', async () => {
    create.mockResolvedValue({ id: 42 });
    await expect(
      service.create({
        comentario: ' <b>Más espacios de escucha.</b>\n',
        consentimiento: true,
        website: '',
      }),
    ).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith({
      data: { comentario: 'Más espacios de escucha.' },
    });
  });

  it('rechaza texto vacío o identificable', async () => {
    await expect(
      service.create({ comentario: '  ', consentimiento: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.create({
        comentario: 'Mi correo es nombre@ejemplo.com',
        consentimiento: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('descarta el campo trampa sin guardar', async () => {
    await expect(
      service.create({
        comentario: 'Comentario automatizado',
        consentimiento: true,
        website: 'spam',
      }),
    ).resolves.toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
  });
});
