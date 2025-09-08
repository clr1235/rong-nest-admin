import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  password: string;

  @ValidateIf(() => false) // 让验证器忽略该字段，也就是不验证该字段
  @IsEmail({}, { message: '邮箱格式错误' })
  email?: string;

  @ValidateIf(() => false) // 让验证器忽略该字段，也就是不验证该字段
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha?: string;

  @ValidateIf(() => false) // 让验证器忽略该字段，也就是不验证该字段
  @IsPhoneNumber('CN', { message: '手机号格式错误' })
  phoneNumber?: string;
}
