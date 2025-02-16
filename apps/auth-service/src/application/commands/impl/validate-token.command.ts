import { ICommand } from "@nestjs/cqrs";

export class ValidateTokenCommand implements ICommand {
  constructor(public readonly token: string) {}
}
