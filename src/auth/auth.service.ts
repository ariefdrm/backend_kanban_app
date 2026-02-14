import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { usersCreateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidV4 } from 'uuid'
import { PayloadDto } from './strategy/dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(private userServices: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) { }

  async register({ email, password, name }: usersCreateInput) {
    const user = await this.userServices.findByEmail(email)

    if (user) {
      throw new ConflictException('Email already registered')
    }

    const newUser = await this.userServices.create({ email: email, password: password, name: name })

    return { message: 'User created successfully', userId: newUser.id };
  }

  async login(email: string, password: string) {
    const user = await this.userServices.findByEmail(email)

    if (!user) throw new UnauthorizedException("Invalid Credentials")

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException("Invalid password")

    const payload: PayloadDto = { sub: user.id, email: user.email, name: user.name }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    })

    const refreshToken = uuidV4()

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

    await this.prismaService.refreshtoken.create({
      data: {
        user_id: user.id,
        token: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}
