import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await await app.listen(3000);
}
bootstrap();
