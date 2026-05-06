import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Allows app to detect JWT as a HTTP cookie

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
