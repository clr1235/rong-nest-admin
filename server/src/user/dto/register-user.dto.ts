import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  password: string;

  @IsEmail({}, { message: '邮箱格式错误' })
  email?: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;

  @IsPhoneNumber('CN', { message: '手机号格式错误' })
  phoneNumber?: string;
}
