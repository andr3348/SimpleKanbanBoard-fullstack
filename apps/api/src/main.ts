import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add /api prefix to all routes
  app.setGlobalPrefix('api');

  // Enable CORS to allow frontend requests
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
  });

  app.use(cookieParser()); // Allows app to detect JWT as a HTTP cookie

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
