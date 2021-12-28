import { Component } from '@angular/core';
import { WorkerStoreService } from './worker-store.service';
import { NG_WEB_WORKER_CONTEXT } from '@ng-web-worker/worker/communication';
import { hi } from '@ng-web-worker/actions';

@Component({
  selector: 'ng-web-worker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly messages$ = this.workerStoreService.messageChannel$;

  constructor(private workerStoreService: WorkerStoreService) {
    this.workerStoreService.registerWorker(
      () => new Worker(new URL('./client.worker', import.meta.url))
    );

    const port = this.workerStoreService.registerWorker(
      () => new Worker(new URL('./secondary.worker', import.meta.url))
    );

    // After two seconds broadcast a `hi` action to all web workers
    setTimeout(() => {
      console.log('Posting first message');
      port.postMessage({
        event: 'action',
        context: NG_WEB_WORKER_CONTEXT,
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
