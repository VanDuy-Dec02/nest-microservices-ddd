import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { MESSAGE_PATTERNS, SERVICES } from "@app/common";
import { CreateUserDto, UpdateUserDto } from "@app/common/dto/users";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Roles } from "@app/common/decorators";
import { RoleEnum } from "@app/common/enums";
import { firstValueFrom } from "rxjs";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: "Create new user" })
  async create(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.USER.CREATE, createUserDto)
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  async findAll() {
    return firstValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.USER.FIND_ALL, {})
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by id" })
  async findOne(@Param("id") id: string) {
    return firstValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.USER.FIND_ONE, { id })
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.USER.UPDATE, {
        id,
        ...updateUserDto,
      })
    );
  }

  @Delete(":id")
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: "Delete user" })
  async remove(@Param("id") id: string) {
    return firstValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.USER.DELETE, { id })
    );
  }
}
