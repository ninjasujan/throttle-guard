import { Module } from '@nestjs/common';
import { RateLimitMiddleware } from './rate-limit.middleware';

@Module({
  controllers: [],
  providers: [RateLimitMiddleware],
  exports: [RateLimitMiddleware],
})
export class MiddlewareModule {}
