import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { usersCreateInput } from 'src/generated/prisma/models';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userServices: UsersService,
    // private prisma: PrismaService,
    private jwtService: JwtService
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

    const isMatch = await compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException("Invalid password")

    const payload = { sub: user.id, email: user.email, name: user.name }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
