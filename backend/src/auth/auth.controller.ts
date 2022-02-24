import { Body, Controller, Post, UsePipes, Request, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UsePipes(ValidationPipe)
  @Post('/login')
  login(@Body() loginDto: LoginDto, @Headers() headers) {
    console.log(headers);
    return this.authService.login(loginDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/register')
  register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const tokens = this.authService.register(registerDto);
    res.cookie('refreshToken', tokens.refresh)
  }
}
