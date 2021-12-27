import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionConnector } from './action-connector';
import { WebWorkerActions } from './web-worker-actions';

@NgModule({
  imports: [EffectsModule.forFeature([ActionConnector])],
  providers: [WebWorkerActions],
})
export class WebWorkerNgrxModule {}
