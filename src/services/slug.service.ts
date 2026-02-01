'use server';
import 'server-only';

import { SlugDAL } from '@/db/slug.dal';
import {
  mapTrackBySlugToApp,
  mapTrackSessionsBySlugToApp,
} from '@/lib/mappers/slug.mapper';
import { createClient } from '@/lib/supabase/server';
import type {
  RouteState,
  TrackBySlug,
  TrackSessionsBySlug,
} from '@/types/slug.type';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getTrackBySlug = cache(async (slug: string) => {
  const db: SupabaseClient = await createClient();
  const data = await SlugDAL.getTrackBySlug(db, slug);
  return mapTrackBySlugToApp(data) as TrackBySlug;
});

export const getTrackSessionsBySlug = cache(async (state: RouteState) => {
  if (!['track', 'year', 'session'].includes(state.kind)) {
    return null;
  }
  const db: SupabaseClient = await createClient();
  const data = await SlugDAL.getTrackSessionsBySlug(db, state);

  return mapTrackSessionsBySlugToApp(data ?? null) as TrackSessionsBySlug;
});
