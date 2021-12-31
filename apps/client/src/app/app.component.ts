import { Component } from '@angular/core';
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
      broadcast: false,
    });

    this.webWorkerRegistry.registerWorker({
      workerId: 'worker2',
      factory: () => new Worker(new URL('./secondary.worker', import.meta.url)),
      broadcast: false,
    });

    // After two seconds broadcast a `hi` action to all web workers
    setTimeout(() => {
      console.log('Posting first message');
      this.webWorkerRegistry.sendMessageToWorker('worker2', {
        workerId: 'main',
        event: 'action',
        context: NG_IN_WEB_WORKER_CONTEXT,
        payload: {
          ...hi(),
          workerId: 'main',
        },
      });
    }, 2000);
  }
}
