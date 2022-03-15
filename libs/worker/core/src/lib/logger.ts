import { Inject, Injectable } from '@angular/core';
import { NG_IN_WORKER_CONFIG, WORKER_ID } from './tokens';
import { WorkerConfig } from './types';

@Injectable()
export class Logger {
  constructor(
    @Inject(WORKER_ID) private workerId: string,
    @Inject(NG_IN_WORKER_CONFIG) private config: WorkerConfig
  ) {}

  log(message: string): void {
    if (this.config.debug)
      console.log(`[NgInWorker - ${this.workerId}] ${message}`);
  }

  error(message: string): void {
    if (this.config.debug)
      console.error(`[NgInWorker - ${this.workerId}] ${message}`);
  }

  warn(message: string): void {
    if (this.config.debug)
      console.warn(`[NgInWorker - ${this.workerId}] ${message}`);
  }
}
