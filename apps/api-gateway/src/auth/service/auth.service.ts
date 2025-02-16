import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SERVICES } from "@app/common";

@Injectable()
export class AuthService {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy
  ) {}

  getClient(): ClientProxy {
    return this.authClient;
  }
}
