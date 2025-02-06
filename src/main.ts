import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  OpenAPIObject,
} from '@nestjs/swagger';
import docsOptions from './shared/swagger/swagger.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a new Nest application
  const customOption: SwaggerCustomOptions = docsOptions.swaggerCustom();
  const swaggerOptions: Omit<OpenAPIObject, 'paths'> = docsOptions.swagger();

  // Swagger 문서 생성 시 태그 순서를 명시적으로 설정
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document, customOption);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
