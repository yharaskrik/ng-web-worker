import { NgModule } from '@angular/core';
import { WebWorkerRegistry } from '@ng-web-worker/worker';

@NgModule({
  providers: [WebWorkerRegistry],
})
export class NgInWorkerModule {}
