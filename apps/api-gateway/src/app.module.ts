import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { appConfig } from "@app/core/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor() {
    console.log("Environment variables loaded:", {
      authHost: process.env.AUTH_SERVICE_HOST,
      authPort: process.env.AUTH_SERVICE_PORT,
    });
  }
}
