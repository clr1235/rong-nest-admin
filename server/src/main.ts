import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalInterceptor } from './core/interceptor/global.interceptor';
import { HttpExecptionFilter } from './core/filter/http-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  // 注册全局拦截器
  app.useGlobalInterceptors(new GlobalInterceptor());
  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExecptionFilter());
  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  // 开启全局跨域
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
