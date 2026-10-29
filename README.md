# API de TOV

Backend NestJS y Prisma del Tecnoobservatorio de violencia. Usa la base MySQL existente para contactos, respuestas históricas de la campaña «Respeta y Promueve» y sugerencias posteriores.

## Desarrollo

Requiere Node.js 22 y una base MySQL. Configura `DATABASE_URL` en `.env` a partir de `.env.example`.

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

La API escucha `PORT` (3000 por defecto) en `0.0.0.0`. `FRONTEND_URL` permite añadir otro origen a CORS; el dominio de TOV en Vercel y `http://localhost:5173` están permitidos. La clave `RESEND_API_KEY` y `MAIL_FROM` se usan para enviar copia del formulario de contacto.

## Encuesta cerrada y buzón

`POST /api/encuestas` devuelve `410 Gone`: la campaña finalizó y ya no se añaden respuestas a la investigación. `GET /api/encuestas/resultados` sigue publicando únicamente agregados de la tabla `Encuesta`.

`POST /api/buzon-sugerencias` acepta `{ "comentario": "...", "consentimiento": true, "website": "" }`. Limita el texto a 500 caracteres, retira etiquetas y caracteres de control, y rechaza patrones evidentes de correo, teléfono o documento. Guarda solo comentario y fecha en `BuzonSugerencia`, sin IP, agente de usuario ni encabezados. Devuelve `201` con `{ "ok": true }` sin identificadores. Un `website` no vacío recibe la misma respuesta sin guardar datos. Los mensajes del buzón no se cuentan en los resultados de la encuesta.

`GET /health` devuelve `{ "ok": true }` cuando la aplicación está disponible.

## Despliegue

El `Dockerfile` compila con Node.js 22. En Railway, conserva el comando previo al despliegue `npx prisma migrate deploy` para aplicar migraciones antes de activar la versión nueva. La migración `20261029061500_add_buzon_sugerencias` crea únicamente `BuzonSugerencia`; no modifica `Encuesta` ni `Contact`.

```bash
npm run lint
npm test -- --runInBand
npm run build
```
