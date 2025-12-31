import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
  }
  return user;
});
