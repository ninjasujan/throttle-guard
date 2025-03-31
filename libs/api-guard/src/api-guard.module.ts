import { DynamicModule, Module, Type } from '@nestjs/common';
import { RedisModule, RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';
import { SlidingWindowLogGuard } from './middlewares';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class ApiGuardModule {
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: ApiGuardModule,
      imports: [
        ConfigModule,
        ...(options.imports || []),
        RedisModule.forRootAsync({
          useFactory: options.useFactory,
          inject: options.inject,
          imports: options.imports,
        }),
      ],
      providers: [SlidingWindowLogGuard],
      exports: [SlidingWindowLogGuard],
    };
  }
}
