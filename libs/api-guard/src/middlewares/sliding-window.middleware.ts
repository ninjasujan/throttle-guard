import {
  Injectable,
  HttpException,
  HttpStatus,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlidingWindowLogGuard implements NestMiddleware {
  private readonly WINDOW_SIZE: number = 60 * 1000; // default
  private readonly LIMIT: number = 5; // default

  constructor(
    @InjectRedis() private readonly redisService: Redis,
    private configService: ConfigService
  ) {
    this.WINDOW_SIZE = Number(this.configService.get('WINDOW_MS') ?? 60); // Default to 60 seconds
    this.LIMIT = Number(this.configService.get('MAX_REQUESTS') ?? 5); // Default to 5 requests
  }

  async use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const key =
        (request.headers['x-ip'] as string) || request.ip || 'key-123';
      const now = Date.now(); // Current timestamp in milliseconds

      // Lua script for atomic execution
      const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowSize = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])

      -- Remove expired logs
      redis.call('ZREMRANGEBYSCORE', key, 0, now - windowSize * 1000)

      -- Get count of remaining requests in the current window
      local requestCount = redis.call('ZCOUNT', key, now - windowSize * 1000, now)

      if requestCount >= limit then
        return requestCount
      end

      -- Log the request with current timestamp
      redis.call('ZADD', key, now, tostring(now))

      -- Ensure TTL for key expiry
      redis.call('EXPIRE', key, windowSize)

      return requestCount
    `;

      // Execute the Lua script
      const requestCount: number = (await this.redisService.eval(
        luaScript,
        1,
        key,
        now,
        this.WINDOW_SIZE,
        this.LIMIT
      )) as number;

      console.log(
        `Request count for key ${key}: ${requestCount} at ${new Date(
          now
        ).toISOString()}`
      );

      if (Number(requestCount) >= this.LIMIT) {
        throw new HttpException(
          'Too Many Requests',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Add default X-Rate-Limit headers to the response
      response.setHeader('X-Rate-Limit-Limit', this.LIMIT);
      response.setHeader(
        'X-Rate-Limit-Remaining',
        Math.max(this.LIMIT - requestCount - 1, 0)
      );
      response.setHeader(
        'X-Rate-Limit-Reset',
        Math.ceil((now + this.WINDOW_SIZE * 1000) / 1000)
      );
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      next(error);
    }
  }
}
