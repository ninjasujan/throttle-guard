import { DynamicModule, Module } from '@nestjs/common';
import { TrafixGuard } from './guards/trafix.guard';
import { RedisModule, RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';
import { SlidingWindowService } from './service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SlidingWindowService, TrafixGuard],
  exports: [SlidingWindowService],
  controllers: [],
})
export class TrafixModule {
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: TrafixModule,
      imports: [
        ...(options.imports || []),
        RedisModule.forRootAsync({
          useFactory: options.useFactory,
          inject: options.inject,
          imports: options.imports,
        }),
      ],
    };
  }
}
