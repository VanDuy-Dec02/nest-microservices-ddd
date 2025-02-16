import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from "@nestjs/microservices";
import { MESSAGE_PATTERNS } from "@app/common/constants";
import { CreateUserCommand } from "../../application/commands/impl/create-user.command";
import { UpdateUserCommand } from "../../application/commands/impl/update-user.command";
import { DeleteUserCommand } from "../../application/commands/impl/delete-user.command";
import { GetUserQuery } from "../../application/queries/impl/get-user.query";
import { GetUsersQuery } from "../../application/queries/impl/get-users.query";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../../domain/entities/user.entity";

@Controller()
export class UserListener {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserRepository
  ) {}

  @MessagePattern(MESSAGE_PATTERNS.USER.CREATE)
  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<User> {
    return this.commandBus.execute(
      new CreateUserCommand(
        data.email,
        data.firstName,
        data.lastName,
        data.role as any
      )
    );
  }

  @MessagePattern(MESSAGE_PATTERNS.USER.UPDATE)
  async updateUser(data: { id: string; updateData: any }): Promise<User> {
    return this.commandBus.execute(
      new UpdateUserCommand(data.id, data.updateData)
    );
  }

  @MessagePattern(MESSAGE_PATTERNS.USER.DELETE)
  async deleteUser(data: { id: string }): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(data.id));
  }

  @MessagePattern(MESSAGE_PATTERNS.USER.FIND_ONE)
  async findOne(data: { id: string }): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(data.id));
  }

  @MessagePattern(MESSAGE_PATTERNS.USER.FIND_ALL)
  async findAll(data: { isActive?: boolean }): Promise<User[]> {
    return this.queryBus.execute(new GetUsersQuery(data.isActive));
  }

  // Thêm các phương thức tiện ích nếu cần
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }
}
