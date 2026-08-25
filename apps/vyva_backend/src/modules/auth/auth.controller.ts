import { Controller, Post, Get, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { email: string; password?: string; displayName: string; gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' }) {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password?: string }) {
    return await this.authService.login(body);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() body: { googleToken: string; email?: string; displayName?: string }) {
    return await this.authService.googleAuth(body);
  }

  @Get('me')
  async getProfile(@Query('userId') userId?: string) {
    return await this.authService.getProfile(userId || 'usr_me_77');
  }
}
