import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigExtractor, SlidingWindowService } from '../service';

@Injectable()
export class TrafixGuard implements CanActivate {
  constructor(
    private readonly slidingWindowService: SlidingWindowService,
    private readonly ConfigExtractor: ConfigExtractor
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { ipHeader, message, statusCode } = this.ConfigExtractor.getConfig();
    const ip =
      request.headers[ipHeader ?? 'x-forwarded-for'] ||
      request.connection.remoteAddress;

    const { isAllowed, remainingRequests } =
      await this.slidingWindowService.validateAPIRequest(ip);

    const response = context.switchToHttp().getResponse();
    response.header('X-RateLimit-Remaining', remainingRequests);
    if (!isAllowed) {
      throw new HttpException(
        message ?? 'Too many requests, please try again later.',
        statusCode ?? HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return isAllowed;
  }
}
