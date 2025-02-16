import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "../impl/get-user.query";
import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<User> {
    const user = await this.userRepository.findOne(query.id);
    if (!user) {
      throw new NotFoundException(`User with ID "${query.id}" not found`);
    }
    return user;
  }
}
