import { createClient } from '@/lib/supabase/client';
import {
  clearUser,
  setUser,
  setUserRole,
} from '@/state/reducers/user/user.reducer';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const supabase = createClient();
    const loadRole = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (profile?.role) {
        dispatch(setUserRole(profile.role));
      }
    };
    const fetchAuthStatus = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        dispatch(clearUser());
        return;
      }

      dispatch(setUser(user));
      await loadRole(user.id);
    };

    fetchAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          dispatch(clearUser());
          return;
        }
        dispatch(setUser(session.user));
        void loadRole(session.user.id);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [dispatch]);

  return userState.user;
};
