import { DynamicModule, Global, Module } from '@nestjs/common';
import { TrafixGuard } from './guards/trafix.guard';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SlidingWindowService } from './service';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './memory-store';
import { IRateLimiterOption } from './types';
import { RATE_LIMIT_CONFIG } from './constant';

@Global()
@Module({})
export class TrafixModule {
  static forRootAsync(options: IRateLimiterOption): DynamicModule {
    return {
      module: TrafixModule,
      imports: [
        ...(options.redis.imports || []),
        ConfigModule,
        RedisModule.forRootAsync({
          useFactory: options.redis.useFactory,
          inject: options.redis.inject,
          imports: options.redis.imports,
        }),
      ],
      providers: [
        {
          provide: RATE_LIMIT_CONFIG,
          useValue: options.config,
        },
        SlidingWindowService,
        TrafixGuard,
        RedisService,
      ],
      exports: [SlidingWindowService, TrafixGuard],
    };
  }
}
