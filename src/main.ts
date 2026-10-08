import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para permitir peticiones desde tu frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'https://tov-v2.vercel.app',
      'http://localhost:5173',
    ].filter(Boolean),
    methods: 'GET,POST',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log('API escuchando');
}
bootstrap().catch((error: unknown) => {
  console.error(
    'No se pudo iniciar la API',
    error instanceof Error ? error.message : 'Error desconocido',
  );
  process.exit(1);
});
