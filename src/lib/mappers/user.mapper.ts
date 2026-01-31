import type { User } from '@/types';
import type { User as UserRow } from '@supabase/supabase-js';

export const mapUserRowToApp = (user: UserRow): User => {
  return {
    id: user.id,
    email: user.email ?? '',
    firstName: user.user_metadata.first_name,
    lastName: user.user_metadata.last_name,
    fullName: user.user_metadata.full_name,
    avatarUrl: user.user_metadata.avatar_url ?? null,
    role: (user.user_metadata as { role?: string } | undefined)?.role as
      | 'admin'
      | 'team'
      | 'user'
      | undefined,
    emailVerified: user.user_metadata.email_verified ?? false,
    lastSignInAt: user.last_sign_in_at ?? null,
    isAuthenticated: user !== null,
  };
};
