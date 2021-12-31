import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgInWorkerModule } from '@ng-web-worker/worker';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgInWorkerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
