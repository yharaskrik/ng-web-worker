import { InjectionToken } from '@angular/core';
import { NgWebWorkerConfig } from './types';

export const NG_WEB_WORKER_CONFIG = new InjectionToken<NgWebWorkerConfig>(
  'ng-web-worker-config'
);

export const NG_WORKER_ID = new InjectionToken<string>('ng-worker-id');
