import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getWinner, createWinner, updateWinner,
  stopEngine,
  startEngine as startEngineApi,
  drive as driveApi,
} from '../api/client';
import { Car } from '../api/types';
import ApiError from '../api/ApiError';

export type CarStatus = 'idle' | 'started' | 'driving' | 'finished' | 'broken';

interface CarRaceState {
  status: CarStatus;
  duration: number;
  progress: number; // 0..1 — how far the car got (1 = finish, <1 = broke mid-race)
}

export interface RaceWinner {
  id: number;
  name: string;
  time: number; // seconds
}

interface RaceState {
  isRacing: boolean;
  resetSignal: number;
  allCarsSettled: boolean; // all cars finished or broken — unlocks pagination
  winner: RaceWinner | null;
  cars: Record<number, CarRaceState>;
}

const initialState: RaceState = {
  isRacing: false,

  resetSignal: 0,
  allCarsSettled: false,
  winner: null,
  cars: {},
};

// --- Slice ---

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setCarStatus(
      state,
      action: PayloadAction<{ id: number; status: CarStatus; duration?: number; progress?: number }>,
    ) {
      const { id, status, duration, progress } = action.payload;
      state.cars[id] = {
        status,
        duration: duration ?? state.cars[id]?.duration ?? 0,
        progress: progress ?? state.cars[id]?.progress ?? 0,
      };
    },
    startRace(state) {
      state.isRacing = true;
      state.allCarsSettled = false;
      state.winner = null;
    },
    setAllCarsSettled(state) {
      state.allCarsSettled = true;
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
      state.allCarsSettled = false;
      state.winner = null;
      state.cars = {};
      state.resetSignal += 1;
    },
  },
});

export const {
  startRace, setCarStatus, setAllCarsSettled, setRacing, setWinner, resetRace,
} = raceSlice.actions;

// --- Thunks ---

export const raceAllCars = createAsyncThunk(
  'race/raceAllCars',
  async (_, { dispatch, getState }) => {
    dispatch(startRace());
    const state = getState() as { race: RaceState; garage: { cars: Car[] } };
    const cars = state.garage.cars;
    const capturedSignal = state.race.resetSignal;

    const isCurrentRace = () => {
      const s = (getState() as { race: RaceState }).race;
      return s.isRacing && s.resetSignal === capturedSignal;
    };

    await Promise.allSettled(
      cars.map(async (car: Car) => {
        let duration: number;
        try {
          const { velocity, distance } = await startEngineApi(car.id);
          duration = Math.round(distance / velocity);
        } catch {
          return;
        }

        if (!isCurrentRace()) return;
        dispatch(setCarStatus({ id: car.id, status: 'driving', duration, progress: 0 }));

        const driveStart = Date.now();
        try {
          await driveApi(car.id);
          if (!isCurrentRace()) return;
          dispatch(setCarStatus({ id: car.id, status: 'finished', progress: 1 }));
          const time = Math.round(duration / 10) / 100;
          dispatch(setWinner({ id: car.id, name: car.name, time }));
          const saved = (getState() as { race: RaceState }).race.winner?.id === car.id;
          if (saved) void dispatch(saveWinner({ id: car.id, time }));
        } catch (err) {
          if (!isCurrentRace()) return;
          if (err instanceof ApiError && err.status === 500) {
            const elapsed = Date.now() - driveStart;
            const progress = Math.min(elapsed / duration, 0.95);
            dispatch(setCarStatus({ id: car.id, status: 'broken', progress }));
          }
        }
      }),
    );

    if (isCurrentRace()) {
      dispatch(setAllCarsSettled());
    }
  },
);

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

export const stopAllEngines = createAsyncThunk(
  'race/stopAllEngines',
  async (carIds: number[]) => {
    await Promise.allSettled(carIds.map((id) => stopEngine(id)));
  },
);

export default raceSlice.reducer;
