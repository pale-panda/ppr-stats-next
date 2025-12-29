import { TrackSessionApiResponse as ApiResponse, Telemetry } from '@/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type LapTelemetryParams = {
  sessionId: string;
  lapNumber: number | null;
  isComparison?: boolean;
};

export const trackSessionApi = createApi({
  reducerPath: 'trackSessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/sessions',
  }),
  endpoints: (builder) => ({
    fetchTrackSessions: builder.query<ApiResponse, string>({
      query: (query) => (query ? `?${query}` : ''),
    }),
    fetchTrackSessionById: builder.query<Telemetry, string>({
      query: (sessionId: string) => `/${sessionId}`,
    }),
    fetchLapTelemetry: builder.query<Telemetry, LapTelemetryParams>({
      query: ({ sessionId, lapNumber, isComparison }) =>
        `/${sessionId}/laps/${lapNumber}${
          isComparison ? '?comparison=true' : ''
        }`,
    }),
  }),
});

export const {
  useFetchTrackSessionsQuery,
  useFetchTrackSessionByIdQuery,
  useFetchLapTelemetryQuery,
} = trackSessionApi;
