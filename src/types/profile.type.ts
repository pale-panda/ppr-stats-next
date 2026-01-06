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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  lastSignInAt: string | null;
  isAuthenticated: boolean;
};

export type ProfileFilters = {
  id?: string[];
  email?: string[];
  full_name?: string[];
};

export type Profile = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
};
