import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../impl/delete-user.command";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { NotFoundException } from "@nestjs/common";
import { RabbitMQService } from "@app/core/messaging/rabbitmq.service";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userRepository.update(id, { isActive: false });

    // Publish user deleted event
    await this.rabbitMQService.publish("user.deleted", { id });
  }
}
