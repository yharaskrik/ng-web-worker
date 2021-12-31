import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { WebWorkerActionConnector } from './web-worker-action-connector';

@NgModule({
  imports: [EffectsModule.forFeature([WebWorkerActionConnector])],
})
export class WebWorkerNgrxModule {}
