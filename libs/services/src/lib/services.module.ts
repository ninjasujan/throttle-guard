import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';

@Module({
  providers: [AppService],
  exports: [AppService],
})
export class ServicesModule {}
