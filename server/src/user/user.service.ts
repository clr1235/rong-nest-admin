import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

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
}
