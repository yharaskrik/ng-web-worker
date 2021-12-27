import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WorkerStoreService } from './worker-store.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [WorkerStoreService],
  bootstrap: [AppComponent],
})
export class AppModule {}
