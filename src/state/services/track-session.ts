import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Telemetry,
  TrackSessionApiResponse as ApiResponse,
  TrackSessionSearchParams as SearchParams,
} from '@/types';

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
    fetchTrackSessions: builder.query<ApiResponse, SearchParams>({
      query: ({ page = 1, pageSize, query }) =>
        `?page=${page}&pageSize=${pageSize}&query=${query}`,
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
