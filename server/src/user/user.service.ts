import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
  }
}
