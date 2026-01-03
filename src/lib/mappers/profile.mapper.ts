import { Database } from '@/types/supabase.type';
import { ProfileApp } from '@/types/profile.type';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapProfileRowToApp(r: ProfileRow): ProfileApp {
  return {
    fullName: r.full_name,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
  };
}
