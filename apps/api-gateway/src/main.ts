import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle("Microservices API")
    .setDescription("The Microservices API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // CORS
  app.enableCors();

  // Global prefix
  const apiPrefix = configService.get("API_PREFIX", "api");
  const apiVersion = configService.get("API_VERSION", "v1");
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Start the server
  const port = configService.get("API_GATEWAY_PORT", 3000);
  await app.listen(port);
  console.log(`API Gateway is running on: http://localhost:${port}`);
}
bootstrap();
