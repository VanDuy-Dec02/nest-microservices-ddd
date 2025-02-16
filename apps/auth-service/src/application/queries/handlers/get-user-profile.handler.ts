import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserProfileQuery } from "../impl/get-user-profile.query";
import { NotFoundException } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { User } from "../../../domain/entities/user.entity";

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler
  implements IQueryHandler<GetUserProfileQuery>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: GetUserProfileQuery): Promise<User> {
    const user = await this.authRepository.findOne(query.userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${query.userId}" not found`);
    }
    return user;
  }
}
