import { Inject, Injectable } from '@nestjs/common';
import { RATE_LIMIT_CONFIG } from '../constant';
import { IGuardConfig } from '../types';

@Injectable()
export class ConfigExtractor {
  constructor(
    @Inject(RATE_LIMIT_CONFIG) private readonly config: IGuardConfig
  ) {}

  /**
   * Get the configuration for the rate limiter.
   * @returns IGuardConfig
   */
  getConfig(): Partial<IGuardConfig> | IGuardConfig {
    return this.config;
  }
}
