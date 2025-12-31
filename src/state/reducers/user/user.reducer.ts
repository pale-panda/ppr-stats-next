import { normalizeUser } from '@/lib/userUtils';
import type { User } from '@/types/profile.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User as UserData } from '@supabase/supabase-js';

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      if (!action.payload) {
        state.user = { isAuthenticated: false };
        return;
      }
      state.user = normalizeUser(action.payload);
    },
    clearUser: (state) => {
      state.user = { isAuthenticated: false };
    },
    updateUserProfile: (state, action: PayloadAction<UserData>) => {
      const user = normalizeUser(action.payload);
      state.user = { ...state.user, ...user } as User;
    },
  },
});

export const { setUser, clearUser, updateUserProfile } = userSlice.actions;

export default userSlice.reducer;
