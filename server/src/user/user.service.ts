import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ResultData } from 'src/core/utils/result';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CacheEnum } from 'src/common/enum';
import { LOGIN_TOKEN_EXPIRESIN } from 'src/common/constants';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 创建token
  createToken(payload: { username: string; userId: string }): string {
    //jwt会使用secret中配置的密钥，对payload进行加密，从而生成token
    //这里根据用户名与用户ID进行加密，生成token
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  // 注册
  async create(data: RegisterUserDto) {
    // 同步生成盐
    const salt = bcrypt.genSaltSync(10);
    // 同步加密密码
    const hashPassword = bcrypt.hashSync(data.password, salt);

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
      password: hashPassword,
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
    const userInfo: any = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        password: true,
      },
    });
    if (!userInfo) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '用户名不存在');
    }
    // 对比密码
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '密码错误');
    }

    this.updateRedisToken(userInfo.id, userInfo);
    return ResultData.ok(userInfo, '登录成功');
  }

  // 获取用户信息
  async getUserInfo(userData: any) {
    const userInfo = await this.prismaService.user.findUnique({
      where: {
        username: userData.username,
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

  /**
   * 更新redis中的元数据
   * @param token
   * @param metaData
   */
  async updateRedisToken(token: string, metaData: Partial<any>) {
    const oldMetaData = await this.redisService.get(
      `${CacheEnum.LOGIN_TOKEN_KEY}${token}`,
    );

    let newMetaData = metaData;
    if (oldMetaData) {
      newMetaData = Object.assign(oldMetaData, metaData);
    }

    await this.redisService.set(
      `${CacheEnum.LOGIN_TOKEN_KEY}${token}`,
      newMetaData,
      LOGIN_TOKEN_EXPIRESIN,
    );
  }
}
