import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenCommand } from "../impl/refresh-token.command";
import { UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { JwtService } from "@nestjs/jwt";
import { IAuthCredentials } from "@app/common/interfaces/auth";
import { ConfigService } from "@nestjs/config";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(command: RefreshTokenCommand): Promise<IAuthCredentials> {
    const { refreshToken } = command;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("jwt.refreshSecret"),
      });

      const user = await this.authRepository.findOne(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get("jwt.refreshSecret"),
        expiresIn: this.configService.get("jwt.refreshExpiresIn"),
      });

      await this.authRepository.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.configService.get("jwt.expiresIn"),
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
