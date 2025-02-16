import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SERVICES } from "@app/common";
import { UsersController } from "./controllers/users.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: SERVICES.USER,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get("USER_SERVICE_HOST", "localhost"),
            port: parseInt(configService.get("USER_SERVICE_PORT", "3002")),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
