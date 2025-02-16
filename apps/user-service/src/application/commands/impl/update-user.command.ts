import { ICommand } from "@nestjs/cqrs";

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Partial<{
      firstName: string;
      lastName: string;
      isActive: boolean;
    }>
  ) {}
}
