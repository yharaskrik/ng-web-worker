import { createFeature, createReducer, on } from '@ngrx/store';
import { pricesEmitted } from '../actions';
import { calcPriceChanges } from './coin-cap-states.actions';

export interface CoinCapStatsState {
  data: Record<string, number[]>;
  topPriceChanges: Record<string, number>;
}

const initialState: CoinCapStatsState = {
  data: {},
  topPriceChanges: {},
};

function percentageChange(x1: number, x2: number): number {
  return (x2 - x1) / x1;
}

export const { reducer, selectData, name } = createFeature({
  name: 'coinCapStats',
  reducer: createReducer<CoinCapStatsState>(
    initialState,
    on(pricesEmitted, (state, { event }) => ({
      ...state,
      data: Object.entries(event).reduce(
        (prev, [coin, price]) => ({
          ...prev,
          [coin]: [...(state.data[coin] ?? []), price],
        }),
        state.data
      ),
    })),
    on(calcPriceChanges, (state) => ({
      ...state,
      // Parse price changes and sort
      topPriceChanges: Object.entries<number[]>(state.data)
        .filter(([, prices]) => prices?.length > 1)
        .map(([coin, prices]): [string, number] => [
          coin,
          percentageChange(
            prices[prices.length - 2],
            prices[prices.length - 1]
          ),
        ])
        .sort(([, aChange], [, bChange]) => bChange - aChange)
        .splice(0, 10)
        .reduce(
          (prev, [coin, price]) => ({
            ...prev,
            [coin]: price,
          }),
          {}
        ),
    }))
  ),
});
