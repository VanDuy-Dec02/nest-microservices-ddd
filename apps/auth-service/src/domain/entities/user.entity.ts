import { Entity, Column } from "typeorm";
import { BaseEntity } from "@app/core/database";
import { RoleEnum } from "@app/common/enums";
import * as bcrypt from "bcrypt";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: true })
  password: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @Column({ name: "refresh_token", nullable: true, select: false })
  refreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
