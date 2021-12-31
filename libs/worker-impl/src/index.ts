import { WorkerImplModule } from './lib/worker-impl.module';
import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { NgInWorkerConfig } from '@ng-web-worker/worker';

export const config: NgInWorkerConfig = {
  broadcast: false,
  workerId: 'worker1',
};

export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule, config);
}
