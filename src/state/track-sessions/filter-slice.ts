import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  country: (string | null)[];
  trackName: (string | null)[];

  availableTracks?: string[];
  availableCountries?: string[];
}

const initialState: FilterState = {
  country: [],
  trackName: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<FilterState>>) {
      return { ...state, ...action.payload };
    },
    filterCountry(state, action: PayloadAction<string>) {
      const country = action.payload;
      if (state.country.includes(country)) {
        state.country = state.country.filter((c) => c !== country);
      } else {
        state.country.push(country);
      }
    },
    filterTrackName(state, action: PayloadAction<string>) {
      const trackName = action.payload;
      if (state.trackName.includes(trackName)) {
        state.trackName = state.trackName.filter((t) => t !== trackName);
      } else {
        state.trackName.push(trackName);
      }
    },
    resetFilter() {
      return initialState;
    },
  },
});

export const { setFilter, filterCountry, filterTrackName, resetFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
