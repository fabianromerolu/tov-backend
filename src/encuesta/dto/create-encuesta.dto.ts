import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  Equals,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const EMOCIONES = [
  'acompañada',
  'valorada',
  'comprendida',
  'reflexiva',
  'tranquila',
  'motivada',
  'indiferente',
  'otra',
] as const;

export class CreateEncuestaDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @ArrayUnique()
  @IsIn(EMOCIONES, { each: true })
  emociones: string[];

  @IsOptional()
  @IsString()
  @MaxLength(80)
  otraEmocion?: string | null;

  @IsInt()
  @Min(1)
  @Max(5)
  nivelIdentificacion: number;

  @IsIn(['si', 'un_poco', 'no', 'prefiero_no_responder'])
  impactoAutopercepcion: string;

  @IsIn(['si', 'tal_vez', 'no'])
  deseaMasIniciativas: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string | null;

  @Equals(true)
  consentimiento: boolean;

  @IsOptional()
  @IsString()
  website?: string;
}
