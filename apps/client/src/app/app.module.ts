import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgInWorkerModule } from '@ng-web-worker/worker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgInWorkerModule.forRoot(),
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictActionSerializability: true,
        },
      }
    ),
    EffectsModule.forRoot(),
    WebWorkerNgrxModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
