import { InjectionToken } from '@angular/core';
import { RegisterWorkerConfig } from './types';

export const WORKERS = new InjectionToken<RegisterWorkerConfig[]>(
  'register-worker-configs'
);

export const INITIALIZE_WORKERS = new InjectionToken<boolean>(
  'initialize-workers'
);
