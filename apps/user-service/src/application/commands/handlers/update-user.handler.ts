import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "../impl/update-user.command";
import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, updateData } = command;

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.userRepository.update(id, updateData);
  }
}
