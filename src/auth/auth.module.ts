import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env['SECRET_KEY'] as string,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' }
    })
  ],
  providers: [AuthService, JwtStrategy, UsersService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule { }
