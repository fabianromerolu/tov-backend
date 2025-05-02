import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para permitir peticiones desde tu frontend
  app.enableCors({
    origin: 'http://localhost:5173',  // Ajusta al puerto/url donde corre tu React/Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
  console.log('API escuchando en http://localhost:3000');
}
bootstrap();
