import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEncuestaDto } from './create-encuesta.dto';

const valid = {
  emociones: ['acompañada', 'reflexiva'],
  otraEmocion: null,
  nivelIdentificacion: 4,
  impactoAutopercepcion: 'un_poco',
  deseaMasIniciativas: 'si',
  comentario: 'Gracias',
  consentimiento: true,
  website: '',
};

describe('CreateEncuestaDto', () => {
  it('acepta una respuesta válida', async () => {
    expect(
      await validate(plainToInstance(CreateEncuestaDto, valid)),
    ).toHaveLength(0);
  });

  it('rechaza opciones inválidas, duplicados y falta de consentimiento', async () => {
    const errors = await validate(
      plainToInstance(CreateEncuestaDto, {
        ...valid,
        emociones: ['acompañada', 'acompañada'],
        nivelIdentificacion: 6,
        consentimiento: false,
      }),
    );
    expect(errors.map((error) => error.property).sort()).toEqual([
      'consentimiento',
      'emociones',
      'nivelIdentificacion',
    ]);
  });

  it('limita el texto abierto a 500 caracteres', async () => {
    const errors = await validate(
      plainToInstance(CreateEncuestaDto, {
        ...valid,
        comentario: 'a'.repeat(501),
      }),
    );
    expect(errors.some((error) => error.property === 'comentario')).toBe(true);
  });
});
