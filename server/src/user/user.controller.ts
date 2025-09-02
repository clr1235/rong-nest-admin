import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.create(registerUserDto);
  }

  @Post('login')
  login(@Body() userInfo: LoginUserDto) {
    return this.userService.login(userInfo);
  }
}
