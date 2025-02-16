import { RegisterHandler } from "./register.handler";
import { LoginHandler } from "./login.handler";
import { RefreshTokenHandler } from "./refresh-token.handler";
import { ValidateTokenHandler } from "./validate-token.handler";
export const CommandHandlers = [
  RegisterHandler,
  LoginHandler,
  RefreshTokenHandler,
  ValidateTokenHandler,
];
