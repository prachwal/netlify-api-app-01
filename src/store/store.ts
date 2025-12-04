// store/store.ts - Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

/**
 * Type definitions for Redux store
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
