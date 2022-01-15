import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgInWorkerModule } from '@ng-web-worker/worker';
import { WebWorkerNgrxModule } from '@ng-web-worker/worker/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { CoincapStateModule } from './coincap/coincap-state.module';
import { CoinCapStatsModule } from './coincap/stats/coin-cap-stats.module';

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
    StoreDevtoolsModule.instrument(),
    WebWorkerNgrxModule,
    CoincapStateModule,
    CoinCapStatsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
