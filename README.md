# API de TOV

Backend NestJS y Prisma del Tecnoobservatorio de violencia. Usa la base MySQL existente para contactos y respuestas de la campaña «Respeta y Promueve».

## Desarrollo

Requiere Node.js 22 y una base MySQL. Configura `DATABASE_URL` en `.env` a partir de `.env.example`.

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

La API escucha `PORT` (3000 por defecto) en `0.0.0.0`. `FRONTEND_URL` permite añadir otro origen a CORS; el dominio de TOV en Vercel y `http://localhost:5173` están permitidos. La clave `RESEND_API_KEY` y `MAIL_FROM` se usan para enviar copia del formulario de contacto.

## Encuesta

`POST /api/encuestas` recibe las cinco respuestas, consentimiento y el campo trampa `website`. Valida las opciones y longitudes, limpia el texto libre y rechaza patrones evidentes de correo, teléfono o documento. Guarda únicamente respuestas y fecha, sin IP, agente de usuario ni encabezados. Devuelve `201` y `{ "ok": true }` sin identificadores. Un `website` no vacío recibe la misma respuesta sin guardar datos.

`GET /health` devuelve `{ "ok": true }` cuando la aplicación está disponible.

## Despliegue

El `Dockerfile` compila con Node.js 22. En Railway, conserva el comando previo al despliegue `npx prisma migrate deploy` para aplicar migraciones antes de activar la versión nueva. La migración `20261008210000_add_encuesta` crea solo la tabla `Encuesta`; no modifica `Contact`.

```bash
npm run lint
npm test -- --runInBand
npm run build
```
