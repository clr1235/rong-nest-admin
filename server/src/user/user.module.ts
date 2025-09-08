import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   global: true,
    //   useFactory() {
    //     return {
    //       secret: 'rong-nest-admin',
    //       signOptions: { expiresIn: '7d' },
    //     };
    //   },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (config: ConfigService) => {
        console.log(config.get('jwt.secretkey'), 'config---');
        return {
          secret: config.get('jwt.secretkey'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
