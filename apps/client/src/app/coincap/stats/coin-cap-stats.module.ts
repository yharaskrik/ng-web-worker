import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoinCapStatsEffects } from './coin-cap-stats.effects';
import { name, reducer } from './coin-cap-stats.state';

@NgModule({
  imports: [
    StoreModule.forFeature(name, reducer),
    EffectsModule.forFeature([CoinCapStatsEffects]),
  ],
})
export class CoinCapStatsModule {}
