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
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      }

      if (!data.user) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', data.user.id)
        .single();
      if (profileError) {
        console.error(profileError);
      }

      setCurrentProfile(profileData);
      setCurrentUser(data.user);
      setIsAuthenticated(!!data.user);
    };

    fetchAuthStatus();
  }, []);

  return { isAuthenticated: !!isAuthenticated, currentUser, currentProfile };
};
