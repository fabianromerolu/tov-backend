// src/prediction/dto/input-data.dto.ts
import { IsString, IsInt, IsIn, Min, Max } from 'class-validator';

export class InputDataDto {
  @IsString()
  departamento: string;

  @IsString()
  municipio: string;

  @IsString()
  universidad: string;

  @IsString()
  semestre: string;

  @IsString()
  programa: string;

  @IsString()
  @IsIn(['Estudiante', 'Administrativo', 'Docente', 'Externo'])
  rol: string;

  @IsInt()
  @Min(0)
  edad: number;

  @IsString()
  @IsIn(['macho', 'hembra', 'intersexual'])
  sexo: string;

  @IsString()
  @IsIn(['hetero', 'gay', 'lesbiana', 'bisexual', 'otra'])
  orientacion: string;

  @IsString()
  @IsIn(['hombre', 'mujer', 'otra'])
  identidad: string;

  @IsString()
  discapacidad: string;

  @IsString()
  etnia: string;

  @IsString()
  religion: string;

  @IsString()
  estado_civil: string;

  @IsString()
  origen: string;

  @IsInt()
  @Min(1)
  @Max(6)
  estrato: number;
}
