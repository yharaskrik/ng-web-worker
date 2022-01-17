import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { pricesEmitted } from '../actions';
import { calcPriceChanges } from './coin-cap-states.actions';

@Injectable()
export class CoinCapStatsEffects {
  readonly calcPriceChanges$ = createEffect(() =>
    this._actions$.pipe(
      ofType(pricesEmitted),
      map(() => calcPriceChanges())
    )
  );

  constructor(private _actions$: Actions) {}
}
