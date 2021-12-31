import { NgInWorkerConfig } from '@ng-web-worker/worker/core';
import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { WorkerImplModule } from './lib/worker-impl.module';

export const config: NgInWorkerConfig = {
  broadcast: false,
  workerId: 'worker1',
};

export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule, config);
}
