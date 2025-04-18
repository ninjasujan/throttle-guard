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

    const { isAllowed, remainingRequests } =
      await this.slidingWindowService.checkRateLimitOnRequest(ip);

    const response = context.switchToHttp().getResponse();
    //response.header('X-RateLimit-Limit', ??);
    response.header('X-RateLimit-Remaining', remainingRequests);

    if (!isAllowed) {
      response.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
        error: 'Rate limit exceeded',
      });
      return false;
    }

    return isAllowed;
  }
}
