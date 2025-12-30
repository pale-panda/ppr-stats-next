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
} | null;

export type ProfileData = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  updated_at: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string | null;
  updatedAt: string | null;
};
