import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
}
