import type { TelemetryPointApp } from '@/types/telemetry.type';
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
    fetchLapTelemetry: builder.query<TelemetryPointApp[], LapTelemetryParams>({
      query: ({ sessionId, lapNumber, isComparison }) =>
        `/${sessionId}/laps/${lapNumber}${
          isComparison ? '?comparison=true' : ''
        }`,
    }),
  }),
});

export const { useFetchLapTelemetryQuery } = trackSessionApi;
