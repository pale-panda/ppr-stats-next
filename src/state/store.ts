import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/state/reducers/user/user.reducer';
import { setupListeners } from '@reduxjs/toolkit/query';
import { trackSessionApi } from '@/state/services/track-session';
import { trackApi } from '@/state/services/tracks';

export const store = configureStore({
  reducer: {
    [trackApi.reducerPath]: trackApi.reducer,
    [trackSessionApi.reducerPath]: trackSessionApi.reducer,

    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      trackApi.middleware,
      trackSessionApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
