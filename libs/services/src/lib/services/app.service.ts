import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo(): string {
    const a = 10;
    sum = a + 20;
    console.log('Sum:', sum);
    return 'App information';
  }
}
