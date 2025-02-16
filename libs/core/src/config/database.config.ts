import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  type: process.env.DB_TYPE || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "nest_microservices",
  authDatabase: process.env.AUTH_DB_NAME || "auth_service",
  userDatabase: process.env.USER_DB_NAME || "user_service",
}));
