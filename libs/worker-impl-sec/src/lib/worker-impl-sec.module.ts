import { DoBootstrap, NgModule } from '@angular/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WorkerImplSecEffects } from './worker-impl-sec.effects';

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
    EffectsModule.forRoot([WorkerImplSecEffects]),
    WebWorkerNgrxModule,
  ],
})
export class WorkerImplSecModule implements DoBootstrap {
  // Bootstrap function must be supplied
  ngDoBootstrap(): void {}
}
