import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Request, Response } from 'express';
import Redis from 'ioredis';

@Injectable()
export class SlidingWindowLog {
  private readonly WINDOW_SIZE = 60; // 60 seconds
  private readonly LIMIT = 5; // 5 requests per window

  constructor(@InjectRedis() private readonly redisService: Redis) {}

  async slidingWindowLogMiddleware(
    request: Request,
    response: Response
  ): Promise<boolean> {
    const key = (request.headers['x-ip'] as string) || request.ip || 'key-123';
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

    // Add X-Rate-Limit headers to the response
    response.setHeader('X-Rate-Limit-Limit', this.LIMIT);
    response.setHeader(
      'X-Rate-Limit-Remaining',
      Math.max(this.LIMIT - requestCount - 1, 0)
    );
    response.setHeader(
      'X-Rate-Limit-Reset',
      Math.ceil((now + this.WINDOW_SIZE * 1000) / 1000)
    );

    return true; // Request allowed
  }
}
