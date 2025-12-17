import { createAsyncThunk } from '@reduxjs/toolkit';
import { trackSessionService } from '@/services/api/track-sessions/track-session.service';

const getTrackSessions = createAsyncThunk(
  'trackSession/getTrackSessions',
  async (page: number = 1) => {
    try {
      const response = await trackSessionService.getAllTrackSessions(page);
      return response.json();
    } catch (error) {
      throw error;
    }
  }
);

interface LapTelemetryParams {
  sessionId: string;
  lapNumber: number;
  isComparison?: boolean;
}

const getLapTelemetry = createAsyncThunk(
  'trackSession/getLapTelemetry',
  async ({ sessionId, lapNumber, isComparison }: LapTelemetryParams) => {
    try {
      const response = await trackSessionService.getLapTelemetry(
        sessionId,
        lapNumber
      );
      return {
        telemetry: await response.json(),
        type: isComparison ? 'comparison' : 'main',
      };
    } catch (error) {
      throw error;
    }
  }
);

export { getTrackSessions, getLapTelemetry };
