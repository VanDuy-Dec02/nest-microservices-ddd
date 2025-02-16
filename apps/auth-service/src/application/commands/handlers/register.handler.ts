import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "../impl/register.command";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { ConflictException } from "@nestjs/common";
import { User } from "../../../domain/entities/user.entity";
import { Password } from "../../../domain/value-objects/password.vo";

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: RegisterCommand): Promise<User> {
    const { email, password, firstName, lastName } = command;

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await Password.create(password);
    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword.toString(),
    });

    return this.authRepository.create(user);
  }
}
