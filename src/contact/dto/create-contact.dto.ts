// src/contact/dto/create-contact.dto.ts
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty() @Length(2, 100)
  name: string;       // nombre

  @IsNotEmpty() @Length(2, 100)
  lastName: string;   // apellido

  @IsEmail()
  email: string;

  @IsNotEmpty()
  country: string;    // país

  @IsNotEmpty()
  phone: string;      // teléfono

  @IsNotEmpty() @Length(10, 1000)
  message: string;    // motivo o mensaje
}
