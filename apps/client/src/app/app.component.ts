import { Component, Inject } from '@angular/core';
import { hi } from '@ng-web-worker/actions';
import { WebWorkerRegistry } from '@ng-web-worker/worker';
import {
  COMMUNICATOR,
  MessageDispatcher,
  MessageEventStream,
  ofEvent,
} from '@ng-web-worker/worker/core';
import { map } from 'rxjs';

@Component({
  selector: 'ng-web-worker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private webWorkerRegistry: WebWorkerRegistry,
    @Inject(COMMUNICATOR) private communicator: MessageDispatcher,
    private messageEventStream: MessageEventStream
  ) {
    this.messageEventStream
      .stream()
      .pipe(
        ofEvent<number>('timer'),
        map((event) => event.data)
      )
      .subscribe((data) => {
        console.log(data.payload);
      });

    this.webWorkerRegistry.initializeWorker('worker1');
    this.webWorkerRegistry.initializeWorker('worker2');

    // After two seconds broadcast a `hi` action to all web workers
    console.log('Saying Hi in two seconds.');
    setTimeout(() => {
      this.communicator.sendMessage({
        event: 'action',
        payload: {
          ...hi(),
          workerId: 'main',
        },
      });
    }, 2000);

    setTimeout(() => {
      // this.webWorkerRegistry.terminateWorker('worker1');
      // this.webWorkerRegistry.terminateWorker('worker2');
      // this.webWorkerRegistry.terminateWorker('worker1');
      // this.webWorkerRegistry.terminateWorker('workerDoesntExist');
    }, 4000);
  }
}
