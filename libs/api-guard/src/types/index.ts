import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';

export interface IGuardConfigOptions {
  redis: RedisModuleAsyncOptions;
  config?: IGuardConfig;
}

export interface IGuardConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
  statusCode?: number;
  headers?: string[];
}
