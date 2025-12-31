'use server';
import { createClient } from '@/lib/supabase/server';
import type { Tracks } from '@/types';
import type { SearchParams } from 'next/dist/server/request/search-params';
import { cache } from 'react';

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value))
    return value.filter(
      (v): v is string => typeof v === 'string' && v.length > 0
    );
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

export const getTracks = cache(
  async (query?: SearchParams): Promise<Tracks> => {
    const country = toStringArray(query?.country);
    const name = toStringArray(query?.name);

    let filter: { name?: string[]; country?: string[] } = {};
    if (country.length > 0) {
      filter = { ...filter, country };
    }
    if (name.length > 0) {
      filter = { ...filter, name };
    }

    const supabase = await createClient();
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select(`*`)
      .filter(
        'name',
        `${filter?.name ? 'in' : 'neq'}`,
        `(${(filter?.name || []).join(',')})`
      )
      .filter(
        'country',
        `${filter?.country ? 'in' : 'neq'}`,
        `(${(filter?.country || []).join(',')})`
      )
      .order('name', { ascending: true });

    if (tracksError) {
      console.error(JSON.stringify(tracksError));
      throw new Error('Failed to fetch tracks data');
    }

    return tracks as Tracks;
  }
);
