import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ServicesModule } from '@lib/services';
import { MemoryStoreModule } from '@lib/memory-store';
import { RateLimitMiddleware, MiddlewareModule } from '@lib/middleware';

@Module({
  imports: [ServicesModule, MemoryStoreModule, MiddlewareModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
