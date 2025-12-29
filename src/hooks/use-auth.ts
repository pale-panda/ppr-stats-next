import { createClient } from '@/lib/supabase/client';
import { clearUser, setUser } from '@/state/reducers/user/user.reducer';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const supabase = createClient();

    const fetchAuthStatus = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      if (!session?.user) {
        dispatch(clearUser());
        return;
      }

      dispatch(setUser(session.user));
    };

    fetchAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          dispatch(clearUser());
          return;
        }
        dispatch(setUser(session.user));
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [dispatch]);

  return userState;
};
