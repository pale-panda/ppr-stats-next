import type { Database } from '@/types/supabase.type';
import type { TrackApp } from '@/types/track.type';

type TrackRow = Database['public']['Tables']['tracks']['Row'];

export function mapTrackRowToApp(r: TrackRow): TrackApp {
  return {
    id: r.id,
    name: r.name,
    country: r.country,
    lengthMeters: r.length_meters ?? null,
    turns: r.turns ?? null,
    imageUrl: r.image_url ?? null,
    configuration: r.configuration ?? null,
    description: r.description ?? null,
    gpsPoint: (() => {
      const gp = r.gps_point;
      if (!gp) return null;
      if (typeof gp === 'string') {
        try {
          const parsed = JSON.parse(gp);
          if (
            parsed &&
            typeof parsed.lat === 'number' &&
            typeof parsed.lng === 'number'
          )
            return parsed;
        } catch (e) {
          throw e;
          return null;
        }
      }
      if (typeof gp === 'object') return gp;
      return null;
    })(),
  };
}

export function mapTrackRowsToApp(
  rows: TrackRow[] | undefined
): TrackApp[] | undefined {
  if (!rows) return undefined;
  return rows.map(mapTrackRowToApp);
}
