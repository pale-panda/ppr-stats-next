import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', data.session?.user.id)
        .single();
      if (profileError) {
        console.error(profileError);
      }
      // TODO: Check if possible to fetch avatar_url directly from user metadata to reduce calls -> [ data.session?.user.user_metadata.avatar_url ]
      setImage(profileData?.avatar_url ?? null);
    };
    fetchUserImage();
  }, []);

  return image;
};
