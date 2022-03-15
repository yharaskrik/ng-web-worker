import { bootstrapNgWebWorker } from '@ng-web-worker/worker/web-worker';
import { SimpleWorkerModule } from './lib/simple-worker.module';

export async function initWebWorker() {
  await bootstrapNgWebWorker(SimpleWorkerModule);
}
