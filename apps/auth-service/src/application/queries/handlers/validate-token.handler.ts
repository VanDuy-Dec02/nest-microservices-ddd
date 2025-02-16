import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ValidateTokenQuery } from "../impl/validate-token.query";
import { UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../../domain/entities/user.entity";

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(query: ValidateTokenQuery): Promise<User> {
    try {
      console.log("User");

      const payload = this.jwtService.verify(query.token);
      const user = await this.authRepository.findOne(payload.sub);
      console.log("User", user);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
