import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { WorkerImplSecModule } from './lib/worker-impl-sec.module';

export async function initSecWebWorker() {
  await bootstrapNgWebWorker(WorkerImplSecModule);
}
