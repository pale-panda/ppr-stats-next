import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/api/auth/login?redirectTo=' + encodeURIComponent('/'));
  }
  return user;
});
