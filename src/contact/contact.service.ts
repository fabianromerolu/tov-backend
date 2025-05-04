// src/contact/contact.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async create(data: CreateContactDto) {
    const contact = await this.prisma.contact.create({ data });

    // 2) Prepara un HTML estilizado
    const html = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, sans-serif; background:#f5f5f5; padding:20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#6b46c1; padding:20px; text-align:center;">
            <img src="https://tov-v2.vercel.app/logo.png" alt="TOV" width="120" style="display:block; margin:0 auto 10px;" />
            <h1 style="color:#ffffff; font-size:24px; margin:0;">Hemos recibido tu comunicación</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
            <p>Hola <strong>${data.name}</strong>,</p>
            <p>Hemos recibido tu mensaje y hemos guardado una copia en nuestros registros:</p>
            <blockquote style="margin:20px 0; padding:15px 20px; background:#f0e8ff; border-left:4px solid #6b46c1; color:#555;">
              ${data.message}
            </blockquote>
            <p>Te responderemos lo antes posible. ¡Gracias por escribirnos!</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafafa; padding:20px; text-align:center; color:#777777; font-size:14px;">
            <p style="margin:0;">Sigue en contacto con <strong>TOV</strong></p>
            <p style="margin:5px 0 0;">
              <a href="https://tov-v2.vercel.app/" style="color:#6b46c1; text-decoration:none;">Visita nuestro sitio</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;

    // 3) Envía el correo, pero no bloquea la respuesta si falla
    try {
      await this.transporter.sendMail({
        from: `"Tecnoobservatorio de Violencia" <no-reply@tov.com>`,
        to: data.email,
        subject: 'Tecnoobservatorio de Violencia - Copia de tu mensaje',
        html,
      });
      this.logger.log(`Email de confirmación enviado a ${data.email}`);
    } catch (err) {
      this.logger.error(`Falló el envío de email: ${err.message}`);
      // no relanzamos el error
    }

    return contact;
  }
}
