import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import type { FastifyReply } from 'fastify/types/reply';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) { }

  @Post('register')
  async register(@Body() body: CreateUserDto) {

    return this.authservice.register(body)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: CreateUserDto, @Res() res: FastifyReply) {
    // return this.authservice.login(body.email, body.password)

    const { access_token, refresh_token } = await this.authservice.login(body.email, body.password)

    res.setCookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60,
    })

    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    })

    return { message: 'Login Success' }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile() {
    return {
      message: "hello, world",
      statusCode: HttpStatus.OK
    }
  }


}
