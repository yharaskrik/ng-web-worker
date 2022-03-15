import { DoBootstrap, Inject, Injectable, NgModule } from '@angular/core';
import { COMMUNICATOR, MessageDispatcher } from '@ng-web-worker/worker/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import {
  postEvent,
  WorkerServicesModule,
} from '@ng-web-worker/worker/web-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { interval } from 'rxjs';
import { WorkerImplEffects } from './worker-impl.effects';

@Injectable()
export class TimerService {
  constructor(@Inject(COMMUNICATOR) private dispatcher: MessageDispatcher) {
    console.warn('Initialized timer service');
  }

  readonly timer$ = interval(1000).pipe(postEvent('timer', this.dispatcher));
}

@NgModule({
  imports: [
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictActionSerializability: true,
        },
      }
    ),
    EffectsModule.forRoot([WorkerImplEffects]),
    WebWorkerNgrxModule,
    WorkerServicesModule.forRoot([TimerService]),
  ],
})
export class WorkerImplModule implements DoBootstrap {
  // Bootstrap function must be supplied
  ngDoBootstrap(): void {}
}
