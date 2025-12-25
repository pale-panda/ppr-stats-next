import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileName = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.session?.user.id)
        .single();
      if (profileError) {
        console.error(profileError);
      }
      // TODO: Check if possible to fetch avatar_url directly from user metadata to reduce calls -> [ data.session?.user.user_metadata.full_name ]
      setName(profileData?.full_name ?? '?');
    };

    fetchProfileName();
  }, []);

  return name || '?';
};
