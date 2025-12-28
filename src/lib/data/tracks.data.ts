import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Tracks } from '@/types';
import { filterByFilterParams, FilterParams } from '@/lib/filter-utils';

export const getTracks = cache(
  async ({ query }: { query?: FilterParams }): Promise<Tracks> => {
    const supabase = await createClient();
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .order('name', { ascending: true });

    if (tracksError) {
      console.error(JSON.stringify(tracksError));
      throw new Error('Failed to fetch tracks data');
    }

    let filteredTracks;
    const filterQuery = query || {};

    const tracksData: Tracks = tracks;

    if (filterQuery !== undefined) {
      filteredTracks = filterByFilterParams(tracksData, filterQuery);
    } else {
      filteredTracks = tracksData;
    }

    return filteredTracks as Tracks;
  }
);
