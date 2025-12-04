// store/slices/counterSlice.ts - Counter state slice

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Counter state interface
 */
interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

/**
 * Initial counter state
 */
const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

/**
 * Counter slice for managing counter state
 */
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.status = 'idle';
      state.value += 1;
    },
    decrement: (state) => {
      state.status = 'idle';
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.status = 'idle';
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.status = 'idle';
    },
    setLoading: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

/**
 * Export actions
 */
export const {
  increment,
  decrement,
  incrementByAmount,
  reset,
  setLoading,
} = counterSlice.actions;

/**
 * Export reducer
 */
export default counterSlice.reducer;