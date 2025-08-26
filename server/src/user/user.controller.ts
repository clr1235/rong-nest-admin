import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() userInfo: RegisterUserDto) {
    return this.userService.create(userInfo);
  }
}
