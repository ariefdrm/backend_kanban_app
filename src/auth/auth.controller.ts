import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) { }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authservice.register(body)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    return this.authservice.login(body.email, body.password)
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
