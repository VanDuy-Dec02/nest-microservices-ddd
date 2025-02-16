import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ValidateTokenCommand } from "../impl/validate-token.command";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@CommandHandler(ValidateTokenCommand)
export class ValidateTokenHandler
  implements ICommandHandler<ValidateTokenCommand>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(command: ValidateTokenCommand) {
    console.log("Executing ValidateTokenCommand:", command);
    try {
      const payload = await this.jwtService.verifyAsync(command.token, {
        secret: this.configService.get("JWT_SECRET"),
      });
      console.log("Token payload:", payload);
      return payload;
    } catch (error) {
      console.error("Token validation error:", error);
      throw new UnauthorizedException("Invalid token");
    }
  }
}
