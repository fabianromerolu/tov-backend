import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para permitir peticiones desde tu frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', //esto es para desarrolo local
      'https://tov-v2.vercel.app', // dominio de producción
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
  console.log('API escuchando en http://localhost:3000');
}
bootstrap();
