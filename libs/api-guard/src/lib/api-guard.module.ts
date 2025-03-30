import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule, RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';
import { SlidingWindowLog } from './strategies';

@Module({})
export class ApiGuardModule {
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: ApiGuardModule,
      imports: [RedisModule.forRootAsync(options)],
      exports: [SlidingWindowLog],
      providers: [SlidingWindowLog],
    };
  }
}
