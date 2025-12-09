import { sessionsData, lapsData } from './sessions-data';

export interface Track {
  id: string;
  name: string;
  country: string;
  length: number; // in km
  turns: number;
  longestStraight: number; // in meters
  imageUrl: string;
  description: string;
  lapRecord: string;
  recordHolder: string;
  type: 'permanent' | 'street';
}

export const tracksData: Track[] = [
  {
    id: 'phillip-island',
    name: 'Phillip Island',
    country: 'Australia',
    length: 4.448,
    turns: 12,
    longestStraight: 900,
    imageUrl: '/spa-francorchamps-race-track-aerial-view.jpg',
    description:
      'Fast and flowing circuit with spectacular coastal views. Known for its high-speed corners and challenging wind conditions.',
    lapRecord: '1:28.108',
    recordHolder: 'Marc Marquez',
    type: 'permanent',
  },
  {
    id: 'barcelona',
    name: 'Circuit de Barcelona',
    country: 'Spain',
    length: 4.657,
    turns: 16,
    longestStraight: 1047,
    imageUrl: '/nurburgring-race-track-sunset.png',
    description:
      'Technical circuit with a mix of high and low-speed corners. The final sector is particularly demanding on tires.',
    lapRecord: '1:38.680',
    recordHolder: 'Jorge Lorenzo',
    type: 'permanent',
  },
  {
    id: 'mugello',
    name: 'Mugello Circuit',
    country: 'Italy',
    length: 5.245,
    turns: 15,
    longestStraight: 1141,
    imageUrl: '/silverstone-circuit-racing-aerial.jpg',
    description:
      'High-speed circuit set in the Tuscan hills. Features elevation changes and the famous 350 km/h straight.',
    lapRecord: '1:45.519',
    recordHolder: 'Francesco Bagnaia',
    type: 'permanent',
  },
  {
    id: 'assen',
    name: 'Assen TT Circuit',
    country: 'Netherlands',
    length: 4.542,
    turns: 18,
    longestStraight: 487,
    imageUrl: '/monza-circuit-italy-racing.png',
    description:
      'The Cathedral of Speed. One of the oldest and most prestigious circuits in motorcycle racing history.',
    lapRecord: '1:32.017',
    recordHolder: 'Maverick Viñales',
    type: 'permanent',
  },
  {
    id: 'silverstone',
    name: 'Silverstone',
    country: 'United Kingdom',
    length: 5.891,
    turns: 18,
    longestStraight: 770,
    imageUrl: '/barcelona-circuit-spain-racing.png',
    description:
      'Fast and flowing former airfield circuit. Known for its quick direction changes and high-speed complexes.',
    lapRecord: '1:58.168',
    recordHolder: 'Marc Marquez',
    type: 'permanent',
  },
  {
    id: 'losail',
    name: 'Losail International',
    country: 'Qatar',
    length: 5.38,
    turns: 16,
    longestStraight: 1068,
    imageUrl: '/suzuka-circuit-japan-racing-aerial.png',
    description:
      'State-of-the-art floodlit circuit in the desert. Famous for night races with spectacular lighting.',
    lapRecord: '1:53.106',
    recordHolder: 'Jorge Martin',
    type: 'permanent',
  },
];

// Map session track names to track IDs
const trackNameToId: Record<string, string> = {
  'Phillip Island': 'phillip-island',
  'Circuit de Barcelona': 'barcelona',
  'Mugello Circuit': 'mugello',
  'Assen TT Circuit': 'assen',
  Silverstone: 'silverstone',
  'Losail International': 'losail',
};

export function getTrackById(id: string): Track | undefined {
  return tracksData.find((track) => track.id === id);
}

export function getTrackStats(trackId: string) {
  const trackName = tracksData.find((t) => t.id === trackId)?.name;
  if (!trackName) return null;

  const trackSessions = sessionsData.filter((session) => {
    const sessionTrackId = trackNameToId[session.track];
    return sessionTrackId === trackId;
  });

  if (trackSessions.length === 0) {
    return {
      totalSessions: 0,
      totalLaps: 0,
      bestLapTime: '--:--.---',
      avgTopSpeed: 0,
      totalDuration: '0:00:00',
    };
  }

  const totalLaps = trackSessions.reduce((sum, s) => sum + s.laps, 0);

  // Get all lap times from sessions at this track
  const allLapTimes: number[] = [];
  const allTopSpeeds: number[] = [];

  trackSessions.forEach((session) => {
    const sessionLaps = lapsData[session.id] || [];
    sessionLaps.forEach((lap) => {
      allLapTimes.push(lap.time);
      allTopSpeeds.push(lap.topSpeed);
    });
  });

  const bestLapTime = allLapTimes.length > 0 ? Math.min(...allLapTimes) : 0;
  const avgTopSpeed =
    allTopSpeeds.length > 0
      ? Math.round(
          allTopSpeeds.reduce((a, b) => a + b, 0) / allTopSpeeds.length
        )
      : 0;

  // Format best lap time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  // Calculate total duration
  const totalMinutes = trackSessions.reduce((sum, s) => {
    const parts = s.duration.split(':');
    if (parts.length === 2) {
      return sum + Number.parseInt(parts[0]) + Number.parseInt(parts[1]) / 60;
    } else if (parts.length === 3) {
      return (
        sum +
        Number.parseInt(parts[0]) * 60 +
        Number.parseInt(parts[1]) +
        Number.parseInt(parts[2]) / 60
      );
    }
    return sum;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);

  return {
    totalSessions: trackSessions.length,
    totalLaps,
    bestLapTime: bestLapTime > 0 ? formatTime(bestLapTime) : '--:--.---',
    avgTopSpeed,
    totalDuration: `${hours}:${mins.toString().padStart(2, '0')}:00`,
    sessions: trackSessions,
  };
}
