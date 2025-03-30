import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { ApiGuardModule } from '@lib/api-guard';

@Module({
  imports: [
    ApiGuardModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: 'redis://localhost:6379',
      }),
    }),
  ],
  providers: [AppMiddleware],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
