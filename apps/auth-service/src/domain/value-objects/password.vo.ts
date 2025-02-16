import * as bcrypt from "bcrypt";

export class Password {
  private readonly password: string;
  private readonly SALT_ROUNDS = 10;

  private constructor(password: string) {
    this.password = password;
  }

  static async create(password: string): Promise<Password> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Password(hashedPassword);
  }

  static from(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  toString(): string {
    return this.password;
  }
}
