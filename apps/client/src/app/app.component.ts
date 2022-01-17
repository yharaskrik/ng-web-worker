import { Component, Inject } from '@angular/core';
import { hi } from '@ng-web-worker/actions';
import { WebWorkerRegistry } from '@ng-web-worker/worker';
import { COMMUNICATOR, MessageDispatcher } from '@ng-web-worker/worker/core';

@Component({
  selector: 'ng-web-worker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private webWorkerRegistry: WebWorkerRegistry,
    @Inject(COMMUNICATOR) private communicator: MessageDispatcher
  ) {
    this.webWorkerRegistry.registerWorker({
      workerId: 'worker1',
      factory: (name: string) =>
        new Worker(new URL('./client.worker', import.meta.url), {
          name,
        }),
    });

    this.webWorkerRegistry.registerWorker({
      workerId: 'worker2',
      factory: (name: string) =>
        new Worker(new URL('./secondary.worker', import.meta.url), {
          name,
        }),
    });

    // After two seconds broadcast a `hi` action to all web workers
    setTimeout(() => {
      console.log('Posting first message');
      this.communicator.sendMessage({
        event: 'action',
        payload: {
          ...hi(),
          workerId: 'main',
        },
      });
    }, 2000);
  }
}
