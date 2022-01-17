import { InjectionToken } from '@angular/core';
import { NgInWorkerConfig } from './types';

export const NG_IN_WEB_WORKER_CONTEXT = 'ng-web-worker';

export const NG_WEB_WORKER_BROADCAST_CHANNEL = 'ng-web-worker-channel';

export const COMMUNICATOR = new InjectionToken('ng-web-worker-communicator');

export const NG_WEB_WORKER_CONFIG = new InjectionToken<NgInWorkerConfig>(
  'ng-web-worker-config'
);

export const WORKER_ID = new InjectionToken<string>('ng-in-worker-id');
