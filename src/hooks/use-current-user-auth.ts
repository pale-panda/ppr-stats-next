import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  [key: string]: string | null;
};

export const useCurrentUserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const supabase = createClient();

      supabase.auth.getClaims().then((value) => {
        console.log('Auth Claims:', value);
      });

      supabase.auth.getSession().then((value) => {
        console.log('Auth Session:', value);
      });

      supabase.auth.getUser().then((value) => {
        console.log('Auth User:', value);
      });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }

      if (!session) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileError) {
        console.error(profileError);
      }

      setCurrentProfile(profileData);
      setCurrentUser(session.user);
      setIsAuthenticated(!!session.user);
    };

    fetchAuthStatus();
  }, []);

  return { isAuthenticated: !!isAuthenticated, currentUser, currentProfile };
};
