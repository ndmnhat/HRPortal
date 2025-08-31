import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HR Portal API')
    .setDescription('The HR Portal API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve OpenAPI JSON explicitly at a stable path
  const httpAdapter = app.getHttpAdapter();
  const server: any = (httpAdapter as any).getInstance
    ? (httpAdapter as any).getInstance()
    : (httpAdapter as any);
  if (server && typeof server.get === 'function') {
    server.get('/openapi.json', (_req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });
  }

  // Export OpenAPI spec during build when requested
  if (process.env.EXPORT_OPENAPI === 'true') {
    const outputPath = process.env.OPENAPI_OUTPUT_PATH
      ? path.resolve(process.env.OPENAPI_OUTPUT_PATH)
      : path.resolve(__dirname, '../../openapi.json');
    const dir = path.dirname(outputPath);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch {}
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI spec exported to: ${outputPath}`);
    await app.close();
    process.exit(0);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation: http://localhost:${port}/api/docs`);
}
void bootstrap();
