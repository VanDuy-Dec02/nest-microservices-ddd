import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("AuthService");

  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST || "localhost",
      port: parseInt(process.env.AUTH_SERVICE_PORT || "3001", 10),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.listen().then(() => {
    logger.log("Auth Service is running on port 3001");
    logger.log("Transport: TCP");
    logger.log("Host: 0.0.0.0");
  });
}
bootstrap();
