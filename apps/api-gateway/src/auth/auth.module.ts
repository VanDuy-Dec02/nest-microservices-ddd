import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SERVICES } from "@app/common";
import { AuthController } from "./controllers/auth.controller";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./service/auth.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH,
        // imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get("AUTH_SERVICE_HOST", "localhost"),
            port: parseInt(configService.get("AUTH_SERVICE_PORT", "3001")),
            retryAttempts: 5,
            retryDelay: 1000,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, AuthService],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
