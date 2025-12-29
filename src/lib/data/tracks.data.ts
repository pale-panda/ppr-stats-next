import { filterByFilterParams, FilterParams } from '@/lib/filter-utils';
import { createClient } from '@/lib/supabase/server';
import type { Tracks } from '@/types';
import { cache } from 'react';

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

    let filterQuery = {};
    let filteredTracks;
    const filterCountry = query?.country;
    const filterName = query?.name;

    if (filterCountry !== undefined) {
      filterQuery = {
        ...filterQuery,
        country: filterCountry,
      };
    }

    if (filterName !== undefined) {
      filterQuery = {
        ...filterQuery,
        name: filterName,
      };
    }

    const tracksData: Tracks = tracks;

    if (Object.keys(filterQuery).length > 0) {
      filteredTracks = filterByFilterParams(tracksData, filterQuery);
    } else {
      filteredTracks = tracksData;
    }

    return filteredTracks as Tracks;
  }
);
