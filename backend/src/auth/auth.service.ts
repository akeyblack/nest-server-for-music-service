import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { config } from "src/config";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user.id, user.username);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.getUserByUsername(registerDto.username);
    if (user) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const passHash = await bcrypt.hash(registerDto.password, config.SALT);
    const newUser = await this.usersService.createUser({...registerDto, password: passHash});
    return this.generateToken(newUser.id, newUser.username);  
  }

  async generateToken(id: string, username: string) {
    const payload = { id, username }
    return this.jwtService.sign(payload) 
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.getUserByUsername(loginDto.username);
    if (user) {
      const passEquals = await bcrypt.compare(loginDto.password, user.password);
      if (passEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: "Wrong username or password"} )
  }
}