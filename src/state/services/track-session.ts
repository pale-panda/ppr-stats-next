import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Telemetry, TrackSessionApiResponse } from '@/types';

export const trackSessionApi = createApi({
  reducerPath: 'trackSessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/sessions',
  }),
  endpoints: (builder) => ({
    fetchTrackSessions: builder.query<
      TrackSessionApiResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 5 }) =>
        `/page/${page}?pageSize=${pageSize}`,
    }),
    fetchTrackSessionById: builder.query<Telemetry, string>({
      query: (sessionId: string) => `/${sessionId}`,
    }),
  }),
});

export const { useFetchTrackSessionsQuery, useFetchTrackSessionByIdQuery } =
  trackSessionApi;
