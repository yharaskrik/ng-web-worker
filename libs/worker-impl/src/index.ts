import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { WorkerImplModule } from './lib/worker-impl.module';

export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule);
}
