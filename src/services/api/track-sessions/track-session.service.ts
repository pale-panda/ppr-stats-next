import fetchClient from '@/services/client';
import { TrackSession, TrackSessionValues } from '@/types/track-session.type';

class TrackSessionService {
  async getAllTrackSessions(page: number) {
    const response = await fetchClient(
      '/sessions' + page ? `?page=${page}` : '',
      {
        method: 'GET',
      }
    );
    return response;
  }

  async createTrackSession(body: TrackSession) {
    const response = await fetchClient('/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body }),
    });
    return response;
  }
}

export const trackSessionService = new TrackSessionService();
