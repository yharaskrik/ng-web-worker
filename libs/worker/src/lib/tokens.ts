import { InjectionToken } from '@angular/core';
import { RegisterWorkerConfig } from './types';

export const WORKERS = new InjectionToken<RegisterWorkerConfig[]>(
  '[NgInWorker] register-worker-configs'
);

export const INITIALIZE_WORKERS = new InjectionToken<boolean>(
  '[NgInWorker] initialize-workers'
);
