import { Tracks } from '@/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type TrackQueryParams = {
  query?: string;
};

export const trackApi = createApi({
  reducerPath: 'trackApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/tracks',
  }),
  endpoints: (builder) => ({
    fetchTracks: builder.query<Tracks, TrackQueryParams>({
      query: ({ query }) => `?query=${query}`,
    }),
  }),
});

export const { useFetchTracksQuery } = trackApi;
