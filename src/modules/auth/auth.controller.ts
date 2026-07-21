import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const { user, access_token } = await this.authService.login(body);
    reply.setCookie('access_token', access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return user;
  }
}
