// store/store.ts - Redux store configuration with RTK Query

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import { apiSlice } from './api/apiSlice';

/**
 * Redux store configuration with RTK Query
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

/**
 * Type definitions for Redux store
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
