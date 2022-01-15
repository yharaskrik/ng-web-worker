import { createAction, props } from '@ngrx/store';
import { PriceChangeEvent } from './types';

export const pricesEmitted = createAction(
  '[coincap] Prices emitted',
  props<{ event: PriceChangeEvent }>()
);
