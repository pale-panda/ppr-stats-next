import { TrackSession } from '@/types/track-session.type';

class TrackSessionService {
  async getAllTrackSessions(page: number = 1) {
    const response = await fetch(`/api/sessions?page=${page}`, {
      method: 'GET',
    });
    return response;
  }

  async createTrackSession(body: TrackSession) {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body }),
    });
    return response;
  }

  async getLapTelemetry(sessionId: string, lapNumber: number) {
    const response = await fetch(`/api/sessions/${sessionId}/${lapNumber}`, {
      method: 'GET',
    });
    return response;
  }
}

export const trackSessionService = new TrackSessionService();
