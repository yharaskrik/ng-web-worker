import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';

@NgModule({})
export class SimpleWorkerModule implements DoBootstrap {
  constructor() {
    console.log('Simple worker initialized');
  }

  ngDoBootstrap(appRef: ApplicationRef): void {}
}
