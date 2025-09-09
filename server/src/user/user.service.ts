import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { LoginUserDto } from './dto/login-user.dto';
import { ResultData } from 'src/core/utils/result';
import type { RegisterUserDto } from './dto/register-user.dto';

function md5(str) {
  const hash = crypto.createHash('md5');

  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 注册
  async create(data: RegisterUserDto) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (userInfo) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '用户名已存在');
    }

    const userData = {
      ...data,
      password: md5(data.password),
    };

    const user = await this.prismaService.user.create({
      data: userData,
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        phoneNumber: true,
      },
    });
    return ResultData.ok(user, '注册成功');
  }

  // 登录
  async login(data: LoginUserDto) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!userInfo) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '用户名不存在');
    }

    if (userInfo.password !== md5(data.password)) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '密码错误');
    }

    const userData = await this.prismaService.user.findUnique({
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

    return ResultData.ok(userData, '登录成功');
  }

  // 获取用户信息
  async getUserInfo(userData: any) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        id: userData.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
      },
    });
    return ResultData.ok(userInfo, '获取用户信息成功');
  }
}
