import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import type { ResultDataType } from 'src/core/utils/result';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.create(registerUserDto);
  }

  @Post('login')
  async login(@Body() userInfo: LoginUserDto) {
    const result: ResultDataType = await this.userService.login(userInfo);
    // 登录成功之后返回jwt生成的token
    result.data.token = this.jwtService.sign(
      {
        userId: result.data.id,
        username: result.data.username,
      },
      {
        expiresIn: '7d',
      },
    );
    return result;
  }
}
