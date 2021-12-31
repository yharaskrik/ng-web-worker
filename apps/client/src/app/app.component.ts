import { Component } from '@angular/core';
import { WorkerStoreService } from './worker-store.service';
import { hi } from '@ng-web-worker/actions';
import { NG_IN_WEB_WORKER_CONTEXT } from '@ng-web-worker/worker/core';
import { WebWorkerRegistry } from '@ng-web-worker/worker';

@Component({
  selector: 'ng-web-worker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private webWorkerRegistry: WebWorkerRegistry) {
    this.webWorkerRegistry.registerWorker({
      workerId: 'worker1',
      factory: () => new Worker(new URL('./client.worker', import.meta.url)),
      broadcast: true,
    });

    this.webWorkerRegistry.registerWorker({
      workerId: 'worker2',
      factory: () => new Worker(new URL('./secondary.worker', import.meta.url)),
      broadcast: true,
    });

    // After two seconds broadcast a `hi` action to all web workers
    setTimeout(() => {
      console.log('Posting first message');
      this.webWorkerRegistry.sendMessage('worker1', {
        workerId: 'main',
        event: 'action',
        context: NG_IN_WEB_WORKER_CONTEXT,
        payload: {
          ...hi(),
          workerId: 'main',
        },
      });
    }, 2000);

    // this.messages$.subscribe((m) =>
    //   console.log(
    //     `Message event in main thread from worker ${
    //       m.data.worker
    //     } with payload ${JSON.stringify(m.data.payload)}`
    //   )
    // );
  }
}
