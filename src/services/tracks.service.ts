'use server';
import { TracksDAL } from '@/db/tracks.dal';
import {
  mapTrackRowsToApp,
  mapTrackRowToApp,
} from '@/lib/mappers/track.mapper';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getTracks = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.listTracks(db, searchParams);

  return { data: mapTrackRowsToApp(data.data), meta: data.meta };
});

export const getTrackById = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.getTrackById(db, id);

  return data ? mapTrackRowToApp(data) : null;
});
