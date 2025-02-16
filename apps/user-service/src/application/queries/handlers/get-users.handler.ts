import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUsersQuery } from "../impl/get-users.query";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<User[]> {
    if (query.isActive !== undefined) {
      return this.userRepository.findAll({ isActive: query.isActive });
    }

    return this.userRepository.findAll();
  }
}
