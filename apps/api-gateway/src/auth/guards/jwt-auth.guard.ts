import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ClientProxy } from "@nestjs/microservices";
import { MESSAGE_PATTERNS } from "@app/common";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authClient: ClientProxy;

  constructor(private readonly authService: AuthService) {
    super();
    this.authClient = this.authService.getClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug("Auth client:", this.authClient);

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      this.logger.log(
        `Sending validation request to auth service for token: ${token.substring(
          0,
          10
        )}...`
      );

      const user = await firstValueFrom(
        this.authClient.send(MESSAGE_PATTERNS.AUTH.VALIDATE, { token })
      );

      request.user = user;
      return true;
    } catch (error) {
      this.logger.error(
        `Token validation failed: ${error.message}`,
        error.stack
      );
      throw new UnauthorizedException("Token validation failed");
    }
  }

  private extractToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
