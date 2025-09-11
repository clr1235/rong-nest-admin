import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super({
      log: [
        // 设置PrismaClient的log参数，将打印sql到控制台
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  // 在 onModuleInit 的生命周期方法里调用 $connect 来连接数据库。
  async onModuleInit() {
    await this.$connect();
  }
}
