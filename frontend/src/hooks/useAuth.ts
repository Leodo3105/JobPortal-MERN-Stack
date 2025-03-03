import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { getMe } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(getMe());
    }
  }, [isAuthenticated, loading, dispatch]);

  return { user, isAuthenticated, loading, error };
};