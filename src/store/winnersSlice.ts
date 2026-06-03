import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWinners as getWinnersApi, getCar } from '../api/client';
import { WINNERS_PER_PAGE } from '../utils/constants';

export type SortField = 'id' | 'wins' | 'time' | 'name';
export type SortOrder = 'ASC' | 'DESC';

const SERVER_SORT_FIELDS = new Set<SortField>(['id', 'wins', 'time']);

export interface WinnerWithCar {
  id: number;
  wins: number;
  time: number;
  name: string;
  color: string;
}

// --- Thunks ---

interface FetchWinnersArgs {
  page: number;
  sortBy: SortField;
  sortOrder: SortOrder;
}

async function enrichWinner(id: number, wins: number, time: number): Promise<WinnerWithCar> {
  try {
    const car = await getCar(id);
    return { id, wins, time, name: car.name, color: car.color };
  } catch {
    return { id, wins, time, name: `Car #${id}`, color: '#888888' };
  }
}

export const fetchWinners = createAsyncThunk(
  'winners/fetchWinners',
  async ({ page, sortBy, sortOrder }: FetchWinnersArgs) => {
    const serverSort = SERVER_SORT_FIELDS.has(sortBy) ? (sortBy as 'id' | 'wins' | 'time') : undefined;
    const result = await getWinnersApi(page, WINNERS_PER_PAGE, serverSort, serverSort ? sortOrder : undefined);
    let data = await Promise.all(
      result.data.map(({ id, wins, time }) => enrichWinner(id, wins, time)),
    );
    if (sortBy === 'name') {
      data = data.slice().sort((a, b) => {
        const cmp = a.name.localeCompare(b.name);
        return sortOrder === 'ASC' ? cmp : -cmp;
      });
    }
    return { data, totalCount: result.totalCount };
  },
);

// --- Slice ---

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  sortBy: 'wins',
  sortOrder: 'DESC',
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSort(state, action: PayloadAction<SortField>) {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'DESC';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload.data;
        state.totalCount = action.payload.totalCount ?? 0;
      })
      .addCase(fetchWinners.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCurrentPage, setSort } = winnersSlice.actions;
export default winnersSlice.reducer;
