import { ICommand } from "@nestjs/cqrs";
import { RoleEnum } from "@app/common/enums";

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: RoleEnum = RoleEnum.USER
  ) {}
}
