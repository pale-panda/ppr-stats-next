import type { User } from '@/types';
import type { User as UserData } from '@supabase/supabase-js';

export const normalizeUser = (user: UserData): User => {
  return {
    id: user.id,
    email: user.email || '',
    firstName: user.user_metadata.first_name,
    lastName: user.user_metadata.last_name,
    fullName: user.user_metadata.full_name,
    avatarUrl: user.user_metadata.avatar_url || null,
    emailVerified: user.user_metadata.email_verified || false,
    lastSignInAt: user.last_sign_in_at || null,
    createdAt: user.created_at,
    updatedAt: user.updated_at || null,
    isAuthenticated: user !== null,
  };
};
