import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgInWorkerModule } from '@ng-web-worker/worker';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgInWorkerModule.forRoot({
      share: true,
      initializeWorkers: true,
      workers: [
        {
          workerId: 'worker1',
          factory: (name: string) =>
            new Worker(new URL('./client.worker', import.meta.url), {
              name,
            }),
        },
        {
          workerId: 'worker2',
          factory: (name: string) =>
            new Worker(new URL('./secondary.worker', import.meta.url), {
              name,
            }),
          initialize: false,
        },
        {
          workerId: 'simpleWorker',
          factory: (name: string) =>
            new Worker(new URL('./simple.worker', import.meta.url), {
              name,
            }),
          initialize: true,
        },
      ],
    }),
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictActionSerializability: true,
        },
      }
    ),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument(),
    WebWorkerNgrxModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
