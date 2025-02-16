import { IQuery } from "@nestjs/cqrs";

export class GetUsersQuery implements IQuery {
  constructor(public readonly isActive?: boolean) {}
}
