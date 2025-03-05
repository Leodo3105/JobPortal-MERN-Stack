import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidateProfileReducer from './slices/candidateProfileSlice';
import employerProfileReducer from './slices/employerProfileSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidateProfile: candidateProfileReducer,
    employerProfile: employerProfileReducer,
    job: jobReducer,
    application: applicationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;