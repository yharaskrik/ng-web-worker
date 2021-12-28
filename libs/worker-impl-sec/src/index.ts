import { bootstrapNgWebWorker, NgWebWorkerConfig } from '@ng-web-worker/worker';
import { WorkerImplSecModule } from './lib/worker-impl-sec.module';

export const config: NgWebWorkerConfig = { broadcast: true };

export async function initSecWebWorker() {
  await bootstrapNgWebWorker(WorkerImplSecModule, config);
}
