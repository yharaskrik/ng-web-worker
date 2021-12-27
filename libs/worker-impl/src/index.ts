import { WorkerImplModule } from './lib/worker-impl.module';
import { bootstrapNgWebWorker, NgWebWorkerConfig } from '@ng-web-worker/worker';

export const config: NgWebWorkerConfig = { broadcast: true };

export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule, config);
}
