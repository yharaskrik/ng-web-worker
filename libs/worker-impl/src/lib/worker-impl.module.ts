import { DoBootstrap, NgModule } from '@angular/core';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IntervalEffects } from './interval.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([IntervalEffects]),
    WebWorkerNgrxModule,
  ],
})
export class WorkerImplModule implements DoBootstrap {
  ngDoBootstrap(): void {
    console.log('ngDoBootstrap');
  }
}
