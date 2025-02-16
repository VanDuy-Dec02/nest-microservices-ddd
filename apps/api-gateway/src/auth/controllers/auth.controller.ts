import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { MESSAGE_PATTERNS, SERVICES } from "@app/common/constants";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDto, RefreshTokenDto, RegisterDto } from "@app/common";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authClient
      .send(MESSAGE_PATTERNS.AUTH.REGISTER, registerDto)
      .toPromise();
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  async login(@Body() loginDto: LoginDto) {
    return this.authClient
      .send(MESSAGE_PATTERNS.AUTH.LOGIN, loginDto)
      .toPromise();
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  async getProfile(@Req() req) {
    return this.authClient
      .send(MESSAGE_PATTERNS.AUTH.GET_PROFILE, { userId: req.user.id })
      .toPromise();
  }

  @Post("refresh-token")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Token refreshed successfully" })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authClient
      .send(MESSAGE_PATTERNS.AUTH.REFRESH_TOKEN, refreshTokenDto)
      .toPromise();
  }
}
