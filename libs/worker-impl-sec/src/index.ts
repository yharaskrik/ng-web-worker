import { NgInWorkerConfig } from '@ng-web-worker/worker/core';
import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { WorkerImplSecModule } from './lib/worker-impl-sec.module';

export const config: NgInWorkerConfig = {
  broadcast: false,
  workerId: 'worker2',
};

export async function initSecWebWorker() {
  await bootstrapNgWebWorker(WorkerImplSecModule, config);
}
