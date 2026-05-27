import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWinner, createWinner, updateWinner } from '../api/client';
import ApiError from '../api/ApiError';

export type CarStatus = 'idle' | 'started' | 'driving' | 'finished' | 'broken';

interface CarRaceState {
  status: CarStatus;
  duration: number; // ms — distance / velocity * 1000
}

export interface RaceWinner {
  id: number;
  name: string;
  time: number; // seconds
}

interface RaceState {
  isRacing: boolean;
  startSignal: number; // increments each race start to trigger per-car auto-start effects
  winner: RaceWinner | null;
  cars: Record<number, CarRaceState>;
}

const initialState: RaceState = {
  isRacing: false,
  startSignal: 0,
  winner: null,
  cars: {},
};

// --- Thunks ---

export const saveWinner = createAsyncThunk(
  'race/saveWinner',
  async ({ id, time }: { id: number; time: number }) => {
    try {
      const existing = await getWinner(id);
      await updateWinner(id, existing.wins + 1, Math.min(existing.time, time));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        await createWinner(id, 1, time);
      } else {
        throw err;
      }
    }
  },
);

// --- Slice ---

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setCarStatus(
      state,
      action: PayloadAction<{ id: number; status: CarStatus; duration?: number }>,
    ) {
      const { id, status, duration } = action.payload;
      state.cars[id] = { status, duration: duration ?? state.cars[id]?.duration ?? 0 };
    },
    startRace(state) {
      state.isRacing = true;
      state.startSignal += 1;
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    setWinner(state, action: PayloadAction<RaceWinner>) {
      if (!state.winner) {
        state.winner = action.payload;
      }
    },
    resetRace(state) {
      state.isRacing = false;
      state.winner = null;
      state.cars = {};
    },
  },
});

export const { startRace, setCarStatus, setRacing, setWinner, resetRace } = raceSlice.actions;
export default raceSlice.reducer;
