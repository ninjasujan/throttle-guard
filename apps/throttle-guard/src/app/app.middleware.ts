import { SlidingWindowLog } from '@lib/api-guard';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private readonly slidingWindowLogAlg: SlidingWindowLog) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    await this.slidingWindowLogAlg.slidingWindowLogMiddleware(req, res);
    next();
  }
}
