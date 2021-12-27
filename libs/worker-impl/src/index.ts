import { WorkerImplModule } from './lib/worker-impl.module';
import { bootstrapNgWebWorker } from '@ng-web-worker/worker';

export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule);
}
