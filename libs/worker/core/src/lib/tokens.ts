import { InjectionToken } from '@angular/core';
import { WorkerConfig } from './types';

export const NG_IN_WORKER_CONTEXT: 'ng-in-worker-context' =
  'ng-in-worker-context';

export const NG_IN_WORKER_BROADCAST_CHANNEL = 'ng-web-worker-channel';

export const COMMUNICATOR = new InjectionToken('ng-web-worker-communicator');

export const NG_IN_WORKER_CONFIG = new InjectionToken<WorkerConfig>(
  'ng-web-worker-config'
);

export const WORKER_ID = new InjectionToken<string>('ng-in-worker-id');

export const BROADCAST_CHANNEL = new InjectionToken<BroadcastChannel>(
  `ng-in-worker-broadcast-channel`
);
