import { createClient } from '@/lib/supabase/client';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const supabase = createClient();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }

      if (!session) {
        dispatch({ type: 'user/clearUser' });
        return;
      }

      dispatch({ type: 'user/setUser', payload: session.user });
    };

    fetchAuthStatus();
  }, [dispatch]);

  return userState;
};
