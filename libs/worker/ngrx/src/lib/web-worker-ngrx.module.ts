import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionConnector } from './action-connector';

@NgModule({
  imports: [EffectsModule.forFeature([ActionConnector])],
})
export class WebWorkerNgrxModule {}
