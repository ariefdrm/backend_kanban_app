import { Injectable, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt'
import 'dotenv/config'
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.usersCreateInput) {
    const saltRound = Number(process.env["SALT_ROUND"]) || 10
    const hashPass = await bcrypt.hash(data.password, saltRound)

    return await this.prisma.users.create({
      data: {
        email: data.email,
        password: hashPass,
        name: data.name
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })
  }

  async findAll() {
    return await this.prisma.users.findMany()
  }

  async findOne(id: string) {
    return await this.prisma.users.findMany({
      where: {
        id
      }
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email
      }
    })
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
