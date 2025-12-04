// store/index.ts - Store exports with RTK Query

export { store, type RootState, type AppDispatch } from './store';
export { default as counterReducer } from './slices/counterSlice';
export { apiSlice } from './api/apiSlice';
export { 
  useGetHelloQuery, 
  useEchoMessageMutation, 
  useGetHealthQuery, 
  useGetApiInfoQuery 
} from './api/apiSlice';
