import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { UserModule } from "./user.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST || "localhost",
      port: parseInt(process.env.USER_SERVICE_PORT || "3002", 10),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  await app.listen();
  console.log("User Microservice is listening");
}
bootstrap();
