import { Body, Controller, Post, UsePipes, Headers, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
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
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    const tokens = await this.authService.login(loginDto);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
    return res.json(tokens);
  }

  @UsePipes(ValidationPipe)
  @Post('/register') 
  async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<Response> {
    const tokens = await this.authService.register(registerDto);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
    return res.json(tokens);
  }

  @Post('/logout')
  async logout(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const { refreshToken } = req.cookies;
    const result = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.sendStatus(result? HttpStatus.OK : HttpStatus.ACCEPTED);
  }

  @Post('/refresh')
  async refresh(@Res() res: Response, @Req() req: Request): Promise<Response> {
    const { refreshToken } = req.cookies;
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
    return res.json(tokens);
  }
}
