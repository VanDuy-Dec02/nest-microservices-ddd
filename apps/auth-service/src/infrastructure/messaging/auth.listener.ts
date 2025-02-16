import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { CommandBus } from "@nestjs/cqrs";
import { MESSAGE_PATTERNS } from "@app/common/constants";
import { RegisterCommand } from "../../application/commands/impl/register.command";
import { LoginCommand } from "../../application/commands/impl/login.command";
import { ValidateTokenCommand } from "../../application/commands/impl/validate-token.command";
import { RefreshTokenCommand } from "../../application/commands/impl/refresh-token.command";

@Controller()
export class AuthListener {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(MESSAGE_PATTERNS.AUTH.REGISTER)
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.commandBus.execute(
      new RegisterCommand(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      )
    );
  }

  @MessagePattern(MESSAGE_PATTERNS.AUTH.LOGIN)
  async login(data: { email: string; password: string }) {
    return this.commandBus.execute(new LoginCommand(data.email, data.password));
  }

  @MessagePattern(MESSAGE_PATTERNS.AUTH.VALIDATE)
  async validate(data: { token: string }) {
    return this.commandBus.execute(new ValidateTokenCommand(data.token));
  }

  @MessagePattern(MESSAGE_PATTERNS.AUTH.REFRESH_TOKEN)
  async refreshToken(data: { refreshToken: string }) {
    return this.commandBus.execute(new RefreshTokenCommand(data.refreshToken));
  }
}
