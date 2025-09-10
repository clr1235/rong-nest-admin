import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly client: Redis) {}

  getClient(): Redis {
    return this.client;
  }

  /**
   *
   * @param key 存储 key 值
   * @param val key 对应的 val
   * @param ttl 可选，过期时间，单位 毫秒
   */
  async set(key: string, val: any, ttl?: number): Promise<'OK' | null> {
    const data = JSON.stringify(val);
    if (!ttl) return await this.client.set(key, data);
    return await this.client.set(key, data, 'PX', ttl);
  }
  /**
   * 返回对应 value
   * @param key
   */
  async get(key: string): Promise<any> {
    if (!key || key === '*') return null;
    const res: any = await this.client.get(key);
    return JSON.parse(res);
  }
}
