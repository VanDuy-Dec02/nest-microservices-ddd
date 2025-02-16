import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "../impl/login.command";
import { UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { JwtService } from "@nestjs/jwt";
import { Password } from "../../../domain/value-objects/password.vo";
import { IAuthCredentials } from "@app/common/interfaces/auth";
import { ConfigService } from "@nestjs/config";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(command: LoginCommand): Promise<IAuthCredentials> {
    try {
      const { email, password } = command;

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }
      const passwordVo = Password.from(user.password);

      const isValid = await passwordVo.compare(password);
      if (!isValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: this.configService.get("JWT_EXPIRATION", "15m"),
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get("JWT_REFRESH_EXPIRATION", "7d"),
        }),
      ]);

      await this.authRepository.updateRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.configService.get("JWT_EXPIRATION"),
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
