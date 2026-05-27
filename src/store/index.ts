import { configureStore } from '@reduxjs/toolkit';
import garageReducer from './garageSlice';
import winnersReducer from './winnersSlice';
import raceReducer from './raceSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
    race: raceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
