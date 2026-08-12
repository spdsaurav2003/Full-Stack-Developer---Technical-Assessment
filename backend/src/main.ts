import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowed origins: add your Vercel URL(s) here, plus localhost for dev.
  // FRONTEND_URL env var can be a comma-separated list of URLs.
  const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
    : [];

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    // Vercel production deployment
    'https://full-stack-developer-technical-assessment-su69-2kf4vf5ll.vercel.app',
    ...envOrigins,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any *.vercel.app subdomain (covers preview deployments too)
      const isVercel = /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);

      if (allowedOrigins.includes(origin) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
