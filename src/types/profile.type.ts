import type { Database } from '@/types/supabase.type';

export type UserData = {
  id: string;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    full_name: string;
    avatar_url?: string;
    email_verified: boolean;
  };
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  lastSignInAt?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
  isAuthenticated: boolean;
};

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;

export type ProfileUpdate = Partial<Profile>;

export type ProfileFilters = {
  id?: string[];
  email?: string[];
  full_name?: string[];
};

export type ProfileApp = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
}