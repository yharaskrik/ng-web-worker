import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class CoinCapStatsEffects {
  constructor(private _actions$: Actions) {}
}
