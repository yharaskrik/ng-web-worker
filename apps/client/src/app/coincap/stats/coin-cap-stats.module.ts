import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { name, reducer } from './coin-cap-stats.state';

@NgModule({
  imports: [StoreModule.forFeature(name, reducer)],
})
export class CoinCapStatsModule {}
