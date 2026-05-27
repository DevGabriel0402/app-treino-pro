import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exerciseReducer from './slices/exerciseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exerciseReducer,
  },
});
