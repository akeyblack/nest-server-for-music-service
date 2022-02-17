import { IsEmail, IsString, Length } from "class-validator"

export class RegisterDto {
  @IsString({message: "Must be string"})
  @Length(3, 30, {message: "Length must be 3 to 30"})
  readonly username: string

  @IsString({message: "Must be string"})
  @Length(3, 30, {message: "Length must be 3 to 30"})
  readonly password: string

  @IsString({message: "Must be string"})
  @Length(3, 30, {message: "Length must be 3 to 30"})
  @IsEmail({message: "Must be correct email"})
  readonly email: string
}