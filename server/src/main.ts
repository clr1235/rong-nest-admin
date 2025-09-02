import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import { GlobalInterceptor } from './core/interceptor/global.interceptor';
import { HttpExecptionFilter } from './core/filter/http-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局验证管道
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // 注册全局拦截器
  // app.useGlobalInterceptors(new GlobalInterceptor());
  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExecptionFilter());
  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false, // 放开 CSP 限制
    }),
  );
  // 开启全局跨域
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
