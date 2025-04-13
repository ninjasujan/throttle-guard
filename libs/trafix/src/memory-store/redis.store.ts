import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async executeLuaScript<T>(
    script: string,
    keys: string[],
    args: (string | number)[]
  ): Promise<T> {
    try {
      const result = await this.redisClient.eval(
        script,
        keys.length,
        ...keys,
        ...args
      );
      return result as T;
    } catch (error) {
      console.error('Error executing Lua script:', error);
      throw error;
    }
  }
}
