import { Component } from '@angular/core';
import { ofEventType, WorkerStoreService } from './worker-store.service';

@Component({
  selector: 'ng-web-worker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly messages$ = this.workerStoreService.messageChannel$.pipe(
    ofEventType('interval')
  );

  constructor(private workerStoreService: WorkerStoreService) {
    this.workerStoreService.registerWorker(
      () => new Worker(new URL('./client.worker', import.meta.url))
    );

    this.workerStoreService.registerWorker(
      () => new Worker(new URL('./secondary.worker', import.meta.url))
    );

    this.messages$.subscribe(console.log);
  }
}
