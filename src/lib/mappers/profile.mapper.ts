import { ProfileApp } from '@/types/profile.type';
import { Database } from '@/types/supabase.type';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapProfileRowToApp(r: ProfileRow): ProfileApp {
  return {
    fullName:
      r.first_name && r.last_name ? `${r.first_name} ${r.last_name}` : '',
    firstName: r.first_name ?? '',
    lastName: r.last_name ?? '',
    email: r.email ?? '',
  };
}
