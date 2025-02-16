import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../../enums/role.enum";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: RoleEnum, required: false })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}
