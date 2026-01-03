import { LatLngLiteral } from '@/types';
import type { Database } from '@/types/supabase.type';

export type Track = Database['public']['Tables']['tracks']['Row'];

export type TrackInsert = {
  name: string;
  country: string;
  length_meters: number | null;
  turns: number | null;
  configuration: string | null;
  description: string | null;
  image_url: string | null;
  gps_point: LatLngLiteral | null;
};

export type TrackUpdate = Partial<TrackInsert>;

export type TrackFilters = {
  name?: string[];
  country?: string[];
  search?: string;
};

// App-facing track model (camelCase)
export type TrackApp = {
  id: string;
  name: string;
  country: string;
  lengthMeters?: number | null;
  turns?: number | null;
  imageUrl?: string | null;
  configuration?: string | null;
  description?: string | null;
  gpsPoint?: LatLngLiteral | null;
  // Backwards-compatible snake_case aliases
  length_meters?: number | null;
  image_url?: string | null;
  gps_point?: LatLngLiteral | null;
};
