import { getTrackSessions, getLapTelemetry } from '@/state/api/track-session';
import { PaginationMeta, Telemetry, TrackSessionJoined } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  [key: string]: (string | null)[];
}

interface TrackSessionState {
  data: TrackSessionJoined[];
  meta: PaginationMeta;
  filter: FilterState;
  telemetry: { [key: string]: Telemetry };
  availableTracks?: string[];
  availableCountries?: string[];
  isLoading: boolean;
}

const initialState: TrackSessionState = {
  data: [],
  telemetry: {},
  meta: {
    currentPage: 1,
    nextPage: null,
    totalPages: 1,
    totalCount: 0,
    remainingCount: 0,
  },
  filter: {},
  isLoading: false,
};

const trackSessionSlice = createSlice({
  name: 'trackSession',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ [key: string]: string }>) => {
      const searchColumn = Object.keys(action.payload)[0];
      const searchValue = action.payload[searchColumn];
      const currentFilterValues = state.filter[searchColumn] || [];

      if (currentFilterValues.includes(searchValue)) {
        state.filter[searchColumn] = currentFilterValues.filter(
          (value) => value !== searchValue
        );
      } else {
        state.filter[searchColumn] = [...currentFilterValues, searchValue];
      }
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
    setPage: (state, action: PayloadAction<number>) => {
      if (state.meta) {
        state.meta.currentPage = action.payload;
      }
    },
    incrementPage: (state) => {
      if (state.meta) {
        if (state.meta.currentPage < state.meta.totalPages) {
          state.meta.currentPage += 1;
        } else {
          state.meta.currentPage = state.meta.totalPages;
        }
      }
    },
    decrementPage: (state) => {
      if (state.meta) {
        if (state.meta.currentPage > 1) {
          state.meta.currentPage -= 1;
        } else {
          state.meta.currentPage = 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrackSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getTrackSessions.fulfilled,
        (
          state,
          action: PayloadAction<{
            sessions: TrackSessionJoined[];
            meta: PaginationMeta;
          }>
        ) => {
          const data = action.payload;
          state.data = data.sessions;
          state.meta = data.meta;
          state.isLoading = false;
        }
      )
      .addCase(getTrackSessions.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getLapTelemetry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getLapTelemetry.fulfilled,
        (
          state,
          action: PayloadAction<{
            telemetry: Telemetry;
            type: string;
          }>
        ) => {
          state.telemetry = {
            ...state.telemetry,
            [action.payload.type]: action.payload.telemetry,
          };

          state.isLoading = false;
        }
      )
      .addCase(getLapTelemetry.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setFilter, resetFilter, setPage, incrementPage, decrementPage } =
  trackSessionSlice.actions;

export default trackSessionSlice.reducer;
