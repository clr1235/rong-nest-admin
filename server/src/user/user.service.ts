import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 注册
  async create(data: Prisma.UserCreateInput) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (userInfo) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        phoneNumber: true,
      },
    });
  }

  // 登录
  async login(data: LoginUserDto) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!userInfo) {
      return {
        code: HttpStatus.BAD_REQUEST,
        msg: '用户名不存在',
      };
    }

    if (userInfo.password !== data.password) {
      return {
        code: HttpStatus.BAD_REQUEST,
        msg: '密码错误',
      };
    }

    return this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
      },
    });
  }
}
