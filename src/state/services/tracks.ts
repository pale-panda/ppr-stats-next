import { getTracks } from '@/lib/data/tracks.data';
import { Tracks } from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { SearchParams } from 'next/dist/server/request/search-params';

export const trackApi = createApi({
  reducerPath: 'trackServerApi',
  baseQuery: () => ({ data: {} }),
  endpoints: (builder) => ({
    fetchTracks: builder.query<Tracks, SearchParams>({
      queryFn: (query) =>
        getTracks(query)
          .then((tracks) => ({ data: tracks }))
          .catch((error) => ({ error })),
    }),
  }),
});

export const { useFetchTracksQuery } = trackApi;
