import { ModuleWithProviders, NgModule } from '@angular/core';
import { COMMUNICATOR, MessageEventStream } from '@ng-web-worker/worker/core';
import { NG_WORKER_ID } from '@ng-web-worker/worker/web-worker';
import { MainThreadCommunicator } from './main-thread.communicator';
import { WebWorkerRegistry } from './web-worker-registry';

@NgModule({})
export class NgInWorkerModule {
  static forRoot(): ModuleWithProviders<NgInWorkerModule> {
    return {
      ngModule: NgInWorkerModule,
      providers: [
        {
          provide: NG_WORKER_ID,
          useValue: 'main',
        },
        {
          provide: COMMUNICATOR,
          useClass: MainThreadCommunicator,
        },
        WebWorkerRegistry,
        MessageEventStream,
      ],
    };
  }
}
