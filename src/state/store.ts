import { configureStore } from '@reduxjs/toolkit';
import trackSessionReducer from '@/state/reducers/track-sessions/track-session.reducer';
import userReducer from '@/state/reducers/user/user.reducer';

export const store = configureStore({
  reducer: {
    trackSession: trackSessionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
