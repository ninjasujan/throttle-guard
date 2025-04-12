import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SlidingWindowService } from '../service';

@Injectable()
export class TrafixGuard implements CanActivate {
  constructor(private readonly slidingWindowService: SlidingWindowService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    console.log('TrafixGuard is checking the request...');

    return await this.slidingWindowService.isAllowed(ip);
  }
}
