import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { pricesEmitted } from './actions';
import { PriceChangeEvent } from './types';

const coincapStream = webSocket<PriceChangeEvent>(
  'wss://ws.coincap.io/prices?assets=ALL'
);

@Injectable()
export class CoinCapEffects {
  readonly coinPriceStream$ = createEffect(() =>
    coincapStream.pipe(map((event) => pricesEmitted({ event })))
  );

  constructor(private _actions$: Actions) {}
}
