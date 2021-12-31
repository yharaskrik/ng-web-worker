import { Inject, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { WebWorkerActionConnector } from './web-worker-action-connector';
import { ACTIVE_RUNTIME_CHECKS, RuntimeChecks } from '@ngrx/store';

@NgModule({
  imports: [EffectsModule.forFeature([WebWorkerActionConnector])],
})
export class WebWorkerNgrxModule {
  constructor(@Inject(ACTIVE_RUNTIME_CHECKS) runtimeChecks: RuntimeChecks) {
    if (!runtimeChecks.strictActionSerializability) {
      console.warn(
        `strictActionSerializability is currently disabled. This may cause issues with sending messages through BroadcastChannel and MessageChannel.`
      );
    }

    if (runtimeChecks.strictActionWithinNgZone) {
      console.warn(
        `strictActionWithinNgZone cannot be enabled because WebWorkers do not bootstrap Angular within ngZone.`
      );
    }
  }
}
