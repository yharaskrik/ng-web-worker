import { InjectionToken } from '@angular/core';
import { NgInWorkerConfig } from '@ng-web-worker/worker/core';

export const NG_WEB_WORKER_CONFIG = new InjectionToken<NgInWorkerConfig>(
  'ng-web-worker-config'
);

export const NG_WORKER_ID = new InjectionToken<string>('ng-worker-id');
