import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CoinCapEffects } from './coin-cap.effects';

@NgModule({
  imports: [EffectsModule.forFeature([CoinCapEffects])],
})
export class CoincapStateModule {}
