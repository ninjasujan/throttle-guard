import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../memory-store';

@Injectable()
export class SlidingWindowService {
  private readonly WINDOW_SIZE: number; // in milliseconds
  private readonly LIMIT: number;

  constructor(
    private readonly redisService: RedisService,
    private configService: ConfigService
  ) {
    this.WINDOW_SIZE = Number(this.configService.get('WINDOW_MS') ?? 60) * 1000; // Default to 60 seconds
    this.LIMIT = Number(this.configService.get('MAX_REQUESTS') ?? 5); // Default to 5 requests
  }

  async isAllowed(key: string): Promise<boolean> {
    const now = Date.now(); // Current timestamp in milliseconds

    // Lua script for atomic execution
    const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowSize = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])

      -- Remove expired logs
      redis.call('ZREMRANGEBYSCORE', key, 0, now - windowSize)

      -- Get count of remaining requests in the current window
      local requestCount = redis.call('ZCOUNT', key, now - windowSize, now)

      if requestCount >= limit then
        return requestCount
      end

      -- Log the request with current timestamp
      redis.call('ZADD', key, now, tostring(now))

      -- Ensure TTL for key expiry
      redis.call('EXPIRE', key, math.ceil(windowSize / 1000))

      return requestCount
    `;

    // Execute the Lua script
    const requestCount: number =
      await this.redisService.executeLuaScript<number>(
        luaScript,
        [key],
        [now, this.WINDOW_SIZE, this.LIMIT]
      );

    console.log(
      `Request count for key ${key}: ${requestCount} at ${new Date(
        now
      ).toISOString()}`
    );

    return requestCount < this.LIMIT;
  }
}
