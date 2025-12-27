import { configureStore } from '@reduxjs/toolkit';
import trackSessionReducer from '@/state/reducers/track-sessions/track-session.reducer';
import userReducer from '@/state/reducers/user/user.reducer';
import { setupListeners } from '@reduxjs/toolkit/query';
import { trackSessionApi } from '@/state/services/track-session';

export const store = configureStore({
  reducer: {
    [trackSessionApi.reducerPath]: trackSessionApi.reducer,
    trackSession: trackSessionReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(trackSessionApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
