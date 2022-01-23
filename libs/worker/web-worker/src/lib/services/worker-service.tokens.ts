import { InjectionToken, Type } from '@angular/core';

export const _ROOT_WORKER_SERVICES = new InjectionToken<Type<any>[][]>(
  '[NgInWorker] root-internal-worker-services'
);
export const ROOT_WORKER_SERVICES = new InjectionToken<Type<any>[][]>(
  '[NgInWorker] root-worker-services'
);

export const _FEATURE_WORKER_SERVICES = new InjectionToken<Type<any>[][]>(
  '[NgInWorker] feature-internal-worker-services'
);
export const FEATURE_WORKER_SERVICES = new InjectionToken<Type<any>[][]>(
  '[NgInWorker] feature-worker-services'
);
