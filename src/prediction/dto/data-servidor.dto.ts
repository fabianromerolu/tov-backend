// data-servidor.dto.ts
export class DataServidor {
    siYnoVg: Record<'si'|'no', number>;
    tiposDeViolencia: Record<string, number>;
    frecuencia: Record<string, number>;
    siYnoCd: Record<'si'|'no', number>;
    siYnoApoyoU: Record<'si'|'no', number>;
    percepcion: Record<string, number>;
    semestre: Record<string, number>;
    programas: Record<string, number>;
    roles: Record<string, number>;
    rangoEdad: Record<string, number>;
    sexos: Record<string, number>;
    orientacionSexual: Record<string, number>;
    identidadDeGenero: Record<string, number>;
    discapacidades: Record<string, number>;
    etnias: Record<string, number>;
    religiones: Record<string, number>;
    estadoCivil: Record<string, number>;
    origen: Record<string, number>;
    estrato: Record<string, number>;
  }
  