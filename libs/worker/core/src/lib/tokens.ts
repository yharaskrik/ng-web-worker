import { InjectionToken } from '@angular/core';
import { WorkerConfig } from './types';

export const NG_IN_WORKER_CONTEXT: 'ng-in-worker-context' =
  'ng-in-worker-context';

export const NG_IN_WORKER_BROADCAST_CHANNEL = 'ng-in-worker-broadcast-channel';

export const COMMUNICATOR = new InjectionToken('[NgInWorker] communicator');

export const NG_IN_WORKER_CONFIG = new InjectionToken<WorkerConfig>(
  '[NgInWorker] config'
);

export const WORKER_ID = new InjectionToken<string>('[NgInWorker] worker-id');

export const BROADCAST_CHANNEL = new InjectionToken<BroadcastChannel>(
  `[NgInWorker] broadcast-channel`
);
