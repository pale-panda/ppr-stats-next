import { mapUserRowToApp } from '@/lib/mappers/user.mapper';
import type { User } from '@/types/profile.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User as UserRow } from '@supabase/supabase-js';

interface UserState {
  user: User | { isAuthenticated: false };
}

const initialState: UserState = {
  user: { isAuthenticated: false },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserRow>) => {
      if (!action.payload) {
        state.user = { isAuthenticated: false };
        return;
      }
      state.user = mapUserRowToApp(action.payload);
    },
    clearUser: (state) => {
      state.user = { isAuthenticated: false };
    },
    updateUserProfile: (state, action: PayloadAction<UserRow>) => {
      const user = mapUserRowToApp(action.payload);
      state.user = { ...state.user, ...user } as User;
    },
    setUserRole: (state, action: PayloadAction<User['role']>) => {
      if (!('id' in state.user)) return;
      state.user = { ...state.user, role: action.payload } as User;
    },
  },
});

export const { setUser, clearUser, updateUserProfile, setUserRole } =
  userSlice.actions;

export default userSlice.reducer;
