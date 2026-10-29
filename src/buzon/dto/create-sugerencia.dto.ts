import {
  Equals,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSugerenciaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comentario: string;

  @Equals(true)
  consentimiento: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
