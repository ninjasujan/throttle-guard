import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../memory-store';
import { IGuardConfig } from '../types';
import { RATE_LIMIT_CONFIG } from '../constant';

@Injectable()
export class SlidingWindowService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(RATE_LIMIT_CONFIG) private readonly config: IGuardConfig
  ) {}

  async checkRateLimitOnRequest(key: string): Promise<{
    isAllowed: boolean;
    remainingRequests: number;
  }> {
    const now = Date.now(); // Current timestamp

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
        [now, this.config.windowMs * 1000, this.config.maxRequests]
      );

    return {
      isAllowed: requestCount < this.config.maxRequests,
      remainingRequests: this.config.maxRequests - requestCount,
    };
  }
}
