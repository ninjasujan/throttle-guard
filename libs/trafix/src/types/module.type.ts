import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';

/**
 * Options for configuring the rate limiter.
 */
export interface IRateLimiterOption {
  /**
   * Redis configuration options.
   */
  redis: RedisModuleAsyncOptions;
  /**
   * Optional guard configuration.
   */
  config?: Partial<IGuardConfig>;
}

/**
 * Configuration options for the rate limiter guard.
 */
export interface IGuardConfig {
  /**
   * Maximum number of requests allowed within the time window.
   */
  maxRequests: number;
  /**
   * Time window in milliseconds for rate limiting.
   */
  windowMs: number;
  /**
   * Error message to be sent when rate limit is exceeded.
   */
  message: string;
  /**
   * HTTP status code to be sent when rate limit is exceeded.
   */
  statusCode: number;
  /**
   * Headers to be included in the response for rate limit information.
   */
  headers: Array<'X-RateLimit-Limit' | 'X-RateLimit-Remaining'>;
}
