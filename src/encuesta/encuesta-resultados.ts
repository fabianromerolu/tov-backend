import { EMOCIONES } from './dto/create-encuesta.dto';

// Semana del reparto de tarjetas, en hora de Colombia (UTC-5).
export const INICIO_ENTREGAS = new Date('2026-10-26T05:00:00.000Z');
export const FIN_SEMANA_ENTREGAS = new Date('2026-11-02T05:00:00.000Z');

const IMPACTOS = ['si', 'un_poco', 'no', 'prefiero_no_responder'] as const;
const INICIATIVAS = ['si', 'tal_vez', 'no'] as const;

export type RespuestaParaResultados = {
  emociones: unknown;
  nivelIdentificacion: number;
  impactoAutopercepcion: string;
  deseaMasIniciativas: string;
  createdAt: Date;
};

export type ResultadosEncuesta = {
  generadoEn: string;
  desde: '2026-10-26';
  hasta: '2026-11-01';
  total: number;
  comentarios: number;
  porDia: { fecha: string; total: number }[];
  emociones: Record<string, number>;
  identificacion: Record<string, number>;
  impacto: Record<string, number>;
  iniciativas: Record<string, number>;
  cruces: {
    emocionesDeApoyo: number;
    variasEmociones: number;
    altaIdentificacionConImpacto: number;
  };
};

function contador(
  claves: readonly (string | number)[],
): Record<string, number> {
  return Object.fromEntries(claves.map((clave) => [String(clave), 0]));
}

function sumarSiExiste(contadores: Record<string, number>, clave: unknown) {
  if (
    typeof clave === 'string' ||
    (typeof clave === 'number' && Number.isInteger(clave))
  ) {
    const nombre = String(clave);
    if (Object.prototype.hasOwnProperty.call(contadores, nombre)) {
      contadores[nombre] += 1;
    }
  }
}

// Colombia mantiene UTC-5 durante todo el año. Agrupamos por fecha de envío,
// no por fecha de entrega de la tarjeta (ese dato no se recogió).
function fechaColombia(fecha: Date): string {
  return new Date(fecha.getTime() - 5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export function agregarResultados(
  respuestas: RespuestaParaResultados[],
  comentarios: number,
  generadoEn = new Date(),
): ResultadosEncuesta {
  const emociones = contador(EMOCIONES);
  const identificacion = contador([1, 2, 3, 4, 5]);
  const impacto = contador(IMPACTOS);
  const iniciativas = contador(INICIATIVAS);
  const dias = new Map<string, number>();
  const cruces = {
    emocionesDeApoyo: 0,
    variasEmociones: 0,
    altaIdentificacionConImpacto: 0,
  };

  for (const respuesta of respuestas) {
    if (Array.isArray(respuesta.emociones)) {
      // La selección es múltiple: cada emoción cuenta una vez por envío.
      const selecciones = new Set(respuesta.emociones);
      for (const emocion of selecciones) {
        sumarSiExiste(emociones, emocion);
      }
      if (
        ['acompañada', 'valorada', 'comprendida'].some((emocion) =>
          selecciones.has(emocion),
        )
      ) {
        cruces.emocionesDeApoyo += 1;
      }
      if (selecciones.size >= 2) cruces.variasEmociones += 1;
    }
    if (
      [4, 5].includes(respuesta.nivelIdentificacion) &&
      ['si', 'un_poco'].includes(respuesta.impactoAutopercepcion)
    ) {
      cruces.altaIdentificacionConImpacto += 1;
    }
    sumarSiExiste(identificacion, respuesta.nivelIdentificacion);
    sumarSiExiste(impacto, respuesta.impactoAutopercepcion);
    sumarSiExiste(iniciativas, respuesta.deseaMasIniciativas);
    const dia = fechaColombia(respuesta.createdAt);
    dias.set(dia, (dias.get(dia) ?? 0) + 1);
  }

  return {
    generadoEn: generadoEn.toISOString(),
    desde: '2026-10-26',
    hasta: '2026-11-01',
    total: respuestas.length,
    comentarios,
    porDia: [...dias.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, total]) => ({ fecha, total })),
    emociones,
    identificacion,
    impacto,
    iniciativas,
    cruces,
  };
}
