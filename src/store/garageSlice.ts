import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '../api/types';
import {
  getCars as getCarsApi,
  createCar as createCarApi,
  updateCar as updateCarApi,
  deleteCar as deleteCarApi,
  deleteWinner as deleteWinnerApi,
} from '../api/client';
import { CARS_PER_PAGE } from '../utils/constants';

// --- Thunks ---

export const fetchCars = createAsyncThunk('garage/fetchCars', (page: number) =>
  getCarsApi(page, CARS_PER_PAGE),
);

export const addCar = createAsyncThunk(
  'garage/addCar',
  ({ name, color }: { name: string; color: string }) => createCarApi(name, color),
);

export const editCar = createAsyncThunk(
  'garage/editCar',
  ({ id, name, color }: { id: number; name: string; color: string }) =>
    updateCarApi(id, name, color),
);

export const removeCar = createAsyncThunk('garage/removeCar', async (id: number) => {
  await deleteCarApi(id);
  try {
    await deleteWinnerApi(id);
  } catch {
    // 404 expected when car was never a winner
  }
  return id;
});

export const deleteAllCars = createAsyncThunk('garage/deleteAllCars', async () => {
  const { data } = await getCarsApi(1, 9999);
  await Promise.all(
    data.map(async ({ id }) => {
      await deleteCarApi(id);
      try {
        await deleteWinnerApi(id);
      } catch {
        // 404 expected when car was never a winner
      }
    }),
  );
});

// --- Slice ---

interface GarageState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  createName: string;
  createColor: string;
  editId: number | null;
  editName: string;
  editColor: string;
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  createName: '',
  createColor: '#000000',
  editId: null,
  editName: '',
  editColor: '#000000',
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setCreateName(state, action: PayloadAction<string>) {
      state.createName = action.payload;
    },
    setCreateColor(state, action: PayloadAction<string>) {
      state.createColor = action.payload;
    },
    setEditCar(state, action: PayloadAction<{ id: number; name: string; color: string }>) {
      state.editId = action.payload.id;
      state.editName = action.payload.name;
      state.editColor = action.payload.color;
    },
    setEditName(state, action: PayloadAction<string>) {
      state.editName = action.payload;
    },
    setEditColor(state, action: PayloadAction<string>) {
      state.editColor = action.payload;
    },
    clearEdit(state) {
      state.editId = null;
      state.editName = '';
      state.editColor = '#000000';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount ?? 0;
      })
      .addCase(fetchCars.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setCurrentPage,
  setCreateName,
  setCreateColor,
  setEditCar,
  setEditName,
  setEditColor,
  clearEdit,
} = garageSlice.actions;

export default garageSlice.reducer;
