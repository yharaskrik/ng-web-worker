import { DoBootstrap, NgModule } from '@angular/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
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
  ngDoBootstrap(): void {
    console.log('ngDoBootstrap');
  }
}
