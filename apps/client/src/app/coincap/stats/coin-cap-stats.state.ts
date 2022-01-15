import { createFeature, createReducer, on } from '@ngrx/store';
import { pricesEmitted } from '../actions';

export interface CoinCapStatsState {
  data: Record<string, number[]>;
}

const initialState: CoinCapStatsState = {
  data: {},
};

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
    }))
  ),
});
