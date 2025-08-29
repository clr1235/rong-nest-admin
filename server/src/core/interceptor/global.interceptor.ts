import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Record<string, Record<string, any>>) => {
        console.log('拦截的data数据：', data);
        return {
          code: data.code,
          msg: data.msg,
          data: data.data || null,
        };
      }),
    );
  }
}
