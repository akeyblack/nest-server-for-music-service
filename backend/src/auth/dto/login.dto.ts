import { IsString, Length } from "class-validator"

export class LoginDto {
  @IsString({message: "Must be string"})
  @Length(3, 30, {message: "Length must be 3 to 30"})
  readonly username: string
  
  @IsString({message: "Must be string"})
  @Length(3, 30, {message: "Length must be 3 to 30"})
  readonly password: string
}