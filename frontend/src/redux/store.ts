import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidateProfileReducer from './slices/candidateProfileSlice';
import employerProfileReducer from './slices/employerProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidateProfile: candidateProfileReducer,
    employerProfile: employerProfileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;