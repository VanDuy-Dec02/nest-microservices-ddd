import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../impl/create-user.command";
import { ConflictException } from "@nestjs/common";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, firstName, lastName, role } = command;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const user = new User({
      email,
      firstName,
      lastName,
      role,
    });

    return this.userRepository.create(user);
  }
}
