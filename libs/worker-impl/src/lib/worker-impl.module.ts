import { DoBootstrap, NgModule } from '@angular/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WorkerImplEffects } from './worker-impl.effects';

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
})
export class WorkerImplModule implements DoBootstrap {
  // Bootstrap function must be supplied
  ngDoBootstrap(): void {}
}
