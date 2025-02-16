import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "@app/core/database";
import { RabbitMQModule } from "@app/core/messaging/rabbitmq.module";
import { User } from "./domain/entities/user.entity";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { UserListener } from "./infrastructure/messaging/user.listener";
import { CommandHandlers } from "./application/commands/handlers";
import { QueryHandlers } from "./application/queries/handlers";
import { appConfig } from "@app/core/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("USER_DB_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("NODE_ENV") !== "production",
      }),
    }),
    CqrsModule,
    DatabaseModule,
    RabbitMQModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserListener],
  providers: [UserRepository, ...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
