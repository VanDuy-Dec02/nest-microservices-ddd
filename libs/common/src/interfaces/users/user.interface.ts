import { RoleEnum } from "../../enums/role.enum";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
