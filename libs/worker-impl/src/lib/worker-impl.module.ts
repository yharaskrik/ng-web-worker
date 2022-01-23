import { DoBootstrap, Inject, Injectable, NgModule } from '@angular/core';
import { COMMUNICATOR, MessageDispatcher } from '@ng-web-worker/worker/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { postEvent } from '@ng-web-worker/worker/web-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { interval } from 'rxjs';
import { WorkerImplEffects } from './worker-impl.effects';

@Injectable()
export class TimerService {
  constructor(@Inject(COMMUNICATOR) private communicator: MessageDispatcher) {}

  readonly timer$ = interval(1000).pipe(postEvent('timer', this.communicator));
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
  ],
  providers: [TimerService],
})
export class WorkerImplModule implements DoBootstrap {
  constructor(private timerService: TimerService) {}
  // Bootstrap function must be supplied
  ngDoBootstrap(): void {}
}
