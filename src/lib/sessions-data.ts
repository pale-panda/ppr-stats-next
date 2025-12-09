export const sessionsData = [
  {
    id: '1',
    title: 'Race Practice',
    track: 'Phillip Island',
    date: 'Dec 7, 2025',
    duration: '45:23',
    laps: 12,
    bestLap: '1:32.847',
    status: 'completed' as const,
    imageUrl: '/spa-francorchamps-race-track-aerial-view.jpg',
    weather: 'Cloudy',
    temperature: '18°C',
    trackTemp: '32°C',
    avgSpeed: '168 km/h',
    topSpeed: '312 km/h',
    fuelUsed: '14.2 L',
    frontTireWear: 78,
    rearTireWear: 65,
  },
  {
    id: '2',
    title: 'Qualifying',
    track: 'Circuit de Barcelona',
    date: 'Dec 5, 2025',
    duration: '25:42',
    laps: 8,
    bestLap: '1:41.234',
    status: 'completed' as const,
    imageUrl: '/nurburgring-race-track-sunset.png',
    weather: 'Sunny',
    temperature: '24°C',
    trackTemp: '42°C',
    avgSpeed: '156 km/h',
    topSpeed: '298 km/h',
    fuelUsed: '8.6 L',
    frontTireWear: 85,
    rearTireWear: 72,
  },
  {
    id: '3',
    title: 'Endurance Test',
    track: 'Mugello Circuit',
    date: 'Dec 3, 2025',
    duration: '1:24:45',
    laps: 28,
    bestLap: '1:49.567',
    status: 'completed' as const,
    imageUrl: '/silverstone-circuit-racing-aerial.jpg',
    weather: 'Overcast',
    temperature: '20°C',
    trackTemp: '28°C',
    avgSpeed: '162 km/h',
    topSpeed: '324 km/h',
    fuelUsed: '32.4 L',
    frontTireWear: 42,
    rearTireWear: 35,
  },
  {
    id: '4',
    title: 'Free Practice 1',
    track: 'Assen TT Circuit',
    date: 'Dec 10, 2025',
    duration: '--:--',
    laps: 0,
    bestLap: '--:--.---',
    status: 'upcoming' as const,
    imageUrl: '/monza-circuit-italy-racing.png',
    weather: 'Forecast: Clear',
    temperature: '16°C',
    trackTemp: '--',
    avgSpeed: '--',
    topSpeed: '--',
    fuelUsed: '--',
    frontTireWear: 100,
    rearTireWear: 100,
  },
  {
    id: '5',
    title: 'Hot Lap Session',
    track: 'Silverstone',
    date: 'Live Now',
    duration: '18:45',
    laps: 6,
    bestLap: '1:59.123',
    status: 'live' as const,
    imageUrl: '/barcelona-circuit-spain-racing.png',
    weather: 'Sunny',
    temperature: '22°C',
    trackTemp: '38°C',
    avgSpeed: '172 km/h',
    topSpeed: '308 km/h',
    fuelUsed: '6.2 L',
    frontTireWear: 92,
    rearTireWear: 88,
  },
  {
    id: '6',
    title: 'Race Simulation',
    track: 'Losail International',
    date: 'Nov 28, 2025',
    duration: '42:12',
    laps: 18,
    bestLap: '1:54.892',
    status: 'completed' as const,
    imageUrl: '/suzuka-circuit-japan-racing-aerial.png',
    weather: 'Night',
    temperature: '26°C',
    trackTemp: '30°C',
    avgSpeed: '178 km/h',
    topSpeed: '338 km/h',
    fuelUsed: '18.8 L',
    frontTireWear: 58,
    rearTireWear: 48,
  },
];

export const lapsData: Record<string, LapData[]> = {
  '1': [
    {
      lap: 1,
      time: 95.234,
      s1: 32.1,
      s2: 38.4,
      s3: 24.7,
      topSpeed: 298,
      avgSpeed: 165,
    },
    {
      lap: 2,
      time: 94.112,
      s1: 31.8,
      s2: 38.1,
      s3: 24.2,
      topSpeed: 302,
      avgSpeed: 167,
    },
    {
      lap: 3,
      time: 93.567,
      s1: 31.5,
      s2: 37.8,
      s3: 24.3,
      topSpeed: 305,
      avgSpeed: 168,
    },
    {
      lap: 4,
      time: 92.847,
      s1: 31.2,
      s2: 37.5,
      s3: 24.1,
      topSpeed: 312,
      avgSpeed: 170,
    },
    {
      lap: 5,
      time: 93.891,
      s1: 31.6,
      s2: 38.0,
      s3: 24.3,
      topSpeed: 308,
      avgSpeed: 168,
    },
    {
      lap: 6,
      time: 93.234,
      s1: 31.4,
      s2: 37.7,
      s3: 24.1,
      topSpeed: 310,
      avgSpeed: 169,
    },
    {
      lap: 7,
      time: 94.567,
      s1: 32.0,
      s2: 38.2,
      s3: 24.4,
      topSpeed: 304,
      avgSpeed: 166,
    },
    {
      lap: 8,
      time: 93.012,
      s1: 31.3,
      s2: 37.6,
      s3: 24.1,
      topSpeed: 311,
      avgSpeed: 169,
    },
    {
      lap: 9,
      time: 92.987,
      s1: 31.2,
      s2: 37.5,
      s3: 24.3,
      topSpeed: 312,
      avgSpeed: 170,
    },
    {
      lap: 10,
      time: 93.456,
      s1: 31.5,
      s2: 37.8,
      s3: 24.2,
      topSpeed: 309,
      avgSpeed: 168,
    },
    {
      lap: 11,
      time: 93.123,
      s1: 31.3,
      s2: 37.6,
      s3: 24.2,
      topSpeed: 310,
      avgSpeed: 169,
    },
    {
      lap: 12,
      time: 93.678,
      s1: 31.6,
      s2: 37.9,
      s3: 24.2,
      topSpeed: 307,
      avgSpeed: 167,
    },
  ],
  '2': [
    {
      lap: 1,
      time: 103.456,
      s1: 34.2,
      s2: 42.1,
      s3: 27.2,
      topSpeed: 285,
      avgSpeed: 152,
    },
    {
      lap: 2,
      time: 102.234,
      s1: 33.8,
      s2: 41.5,
      s3: 26.9,
      topSpeed: 292,
      avgSpeed: 155,
    },
    {
      lap: 3,
      time: 101.567,
      s1: 33.5,
      s2: 41.2,
      s3: 26.9,
      topSpeed: 295,
      avgSpeed: 156,
    },
    {
      lap: 4,
      time: 101.234,
      s1: 33.4,
      s2: 41.0,
      s3: 26.8,
      topSpeed: 298,
      avgSpeed: 157,
    },
    {
      lap: 5,
      time: 101.891,
      s1: 33.6,
      s2: 41.3,
      s3: 27.0,
      topSpeed: 294,
      avgSpeed: 155,
    },
    {
      lap: 6,
      time: 101.345,
      s1: 33.4,
      s2: 41.1,
      s3: 26.8,
      topSpeed: 297,
      avgSpeed: 156,
    },
    {
      lap: 7,
      time: 102.012,
      s1: 33.7,
      s2: 41.4,
      s3: 26.9,
      topSpeed: 293,
      avgSpeed: 154,
    },
    {
      lap: 8,
      time: 101.678,
      s1: 33.5,
      s2: 41.2,
      s3: 27.0,
      topSpeed: 296,
      avgSpeed: 156,
    },
  ],
  '3': [
    {
      lap: 1,
      time: 112.234,
      s1: 36.8,
      s2: 46.2,
      s3: 29.2,
      topSpeed: 312,
      avgSpeed: 158,
    },
    {
      lap: 2,
      time: 111.567,
      s1: 36.5,
      s2: 45.8,
      s3: 29.3,
      topSpeed: 318,
      avgSpeed: 160,
    },
    {
      lap: 3,
      time: 110.891,
      s1: 36.2,
      s2: 45.5,
      s3: 29.2,
      topSpeed: 320,
      avgSpeed: 162,
    },
    {
      lap: 4,
      time: 110.234,
      s1: 36.0,
      s2: 45.2,
      s3: 29.0,
      topSpeed: 322,
      avgSpeed: 163,
    },
    {
      lap: 5,
      time: 109.567,
      s1: 35.8,
      s2: 44.8,
      s3: 28.9,
      topSpeed: 324,
      avgSpeed: 164,
    },
    {
      lap: 6,
      time: 110.123,
      s1: 36.0,
      s2: 45.1,
      s3: 29.0,
      topSpeed: 321,
      avgSpeed: 162,
    },
  ],
  '5': [
    {
      lap: 1,
      time: 121.456,
      s1: 39.8,
      s2: 50.2,
      s3: 31.5,
      topSpeed: 298,
      avgSpeed: 168,
    },
    {
      lap: 2,
      time: 120.234,
      s1: 39.4,
      s2: 49.6,
      s3: 31.2,
      topSpeed: 304,
      avgSpeed: 170,
    },
    {
      lap: 3,
      time: 119.567,
      s1: 39.1,
      s2: 49.2,
      s3: 31.3,
      topSpeed: 306,
      avgSpeed: 172,
    },
    {
      lap: 4,
      time: 119.123,
      s1: 38.9,
      s2: 49.0,
      s3: 31.2,
      topSpeed: 308,
      avgSpeed: 173,
    },
    {
      lap: 5,
      time: 119.456,
      s1: 39.0,
      s2: 49.2,
      s3: 31.3,
      topSpeed: 307,
      avgSpeed: 172,
    },
    {
      lap: 6,
      time: 119.234,
      s1: 38.9,
      s2: 49.1,
      s3: 31.2,
      topSpeed: 308,
      avgSpeed: 173,
    },
  ],
  '6': [
    {
      lap: 1,
      time: 116.234,
      s1: 38.2,
      s2: 48.1,
      s3: 29.9,
      topSpeed: 328,
      avgSpeed: 174,
    },
    {
      lap: 2,
      time: 115.567,
      s1: 37.9,
      s2: 47.8,
      s3: 29.9,
      topSpeed: 332,
      avgSpeed: 176,
    },
    {
      lap: 3,
      time: 114.892,
      s1: 37.6,
      s2: 47.4,
      s3: 29.9,
      topSpeed: 338,
      avgSpeed: 178,
    },
    {
      lap: 4,
      time: 115.234,
      s1: 37.8,
      s2: 47.6,
      s3: 29.8,
      topSpeed: 335,
      avgSpeed: 177,
    },
    {
      lap: 5,
      time: 115.567,
      s1: 37.9,
      s2: 47.8,
      s3: 29.9,
      topSpeed: 334,
      avgSpeed: 176,
    },
  ],
};

export interface LapData {
  lap: number;
  time: number;
  s1: number;
  s2: number;
  s3: number;
  topSpeed: number;
  avgSpeed: number;
}

export function getSessionById(id: string) {
  return sessionsData.find((session) => session.id === id);
}

export function getLapsBySessionId(id: string): LapData[] {
  return lapsData[id] || [];
}

export function getCompletedSessions() {
  return sessionsData.filter((session) => session.status === 'completed');
}

export const sessionInfo = {
  format: 'RaceBox CSV',
  dataSource: 'RaceBox 2231801485',
  dateUTC: '2025-09-13T11:39:53+00:00',
  date: '13/09/2025',
  time: '11:39:53',
  sessionIndex: 4,
  sessionType: 'Track',
  track: 'Mantorp Park',
  configuration: '',
  totalLaps: 11,
  bestLapTime: 85.865,
  vehicle: 'Yamaha YZF R6',
  weather: {
    temperature: 19.0,
    pressure: 1018,
    humidity: 56,
  },
};

// Lap data with sector times and statistics
export const lapData = [
  {
    lap: 1,
    time: 92.456,
    sector1: 26.12,
    sector2: 42.34,
    sector3: 24.0,
    maxSpeed: 228.5,
    minSpeed: 52.3,
    maxCorneringG: 0.62,
    maxAccelG: 0.58,
    maxBrakingG: 1.21,
  },
  {
    lap: 2,
    time: 87.44,
    sector1: 25.13,
    sector2: 40.57,
    sector3: 21.73,
    maxSpeed: 232.26,
    minSpeed: 54.87,
    maxCorneringG: 0.27,
    maxAccelG: 0.64,
    maxBrakingG: 1.34,
  },
  {
    lap: 3,
    time: 86.892,
    sector1: 24.98,
    sector2: 40.12,
    sector3: 21.78,
    maxSpeed: 233.1,
    minSpeed: 53.2,
    maxCorneringG: 0.68,
    maxAccelG: 0.61,
    maxBrakingG: 1.28,
  },
  {
    lap: 4,
    time: 86.234,
    sector1: 24.87,
    sector2: 39.98,
    sector3: 21.37,
    maxSpeed: 234.2,
    minSpeed: 54.1,
    maxCorneringG: 0.66,
    maxAccelG: 0.63,
    maxBrakingG: 1.31,
  },
  {
    lap: 5,
    time: 85.865,
    sector1: 24.72,
    sector2: 39.76,
    sector3: 21.37,
    maxSpeed: 234.6,
    minSpeed: 55.2,
    maxCorneringG: 0.69,
    maxAccelG: 0.65,
    maxBrakingG: 1.35,
  },
  {
    lap: 6,
    time: 86.102,
    sector1: 24.85,
    sector2: 39.89,
    sector3: 21.38,
    maxSpeed: 233.8,
    minSpeed: 54.8,
    maxCorneringG: 0.67,
    maxAccelG: 0.62,
    maxBrakingG: 1.3,
  },
  {
    lap: 7,
    time: 86.445,
    sector1: 24.92,
    sector2: 40.05,
    sector3: 21.48,
    maxSpeed: 233.2,
    minSpeed: 54.5,
    maxCorneringG: 0.65,
    maxAccelG: 0.6,
    maxBrakingG: 1.27,
  },
  {
    lap: 8,
    time: 86.789,
    sector1: 25.05,
    sector2: 40.22,
    sector3: 21.52,
    maxSpeed: 232.5,
    minSpeed: 53.9,
    maxCorneringG: 0.64,
    maxAccelG: 0.59,
    maxBrakingG: 1.25,
  },
  {
    lap: 9,
    time: 87.123,
    sector1: 25.18,
    sector2: 40.38,
    sector3: 21.57,
    maxSpeed: 231.8,
    minSpeed: 53.5,
    maxCorneringG: 0.63,
    maxAccelG: 0.58,
    maxBrakingG: 1.24,
  },
  {
    lap: 10,
    time: 87.567,
    sector1: 25.32,
    sector2: 40.55,
    sector3: 21.68,
    maxSpeed: 230.9,
    minSpeed: 52.8,
    maxCorneringG: 0.61,
    maxAccelG: 0.56,
    maxBrakingG: 1.22,
  },
  {
    lap: 11,
    time: 88.234,
    sector1: 25.56,
    sector2: 40.85,
    sector3: 21.82,
    maxSpeed: 229.5,
    minSpeed: 51.9,
    maxCorneringG: 0.59,
    maxAccelG: 0.54,
    maxBrakingG: 1.19,
  },
];

// Track coordinates for Mantorp Park (simplified outline)
export const trackCoordinates = [
  { lat: 58.3699, lng: 15.2817 },
  { lat: 58.3698, lng: 15.281 },
  { lat: 58.3695, lng: 15.28 },
  { lat: 58.369, lng: 15.2792 },
  { lat: 58.3685, lng: 15.279 },
  { lat: 58.3678, lng: 15.2795 },
  { lat: 58.3672, lng: 15.2805 },
  { lat: 58.3668, lng: 15.282 },
  { lat: 58.367, lng: 15.2838 },
  { lat: 58.3678, lng: 15.2855 },
  { lat: 58.3688, lng: 15.2862 },
  { lat: 58.3698, lng: 15.2858 },
  { lat: 58.3705, lng: 15.2845 },
  { lat: 58.3707, lng: 15.283 },
  { lat: 58.3705, lng: 15.282 },
  { lat: 58.3699, lng: 15.2817 },
];

// Generate telemetry data for charts (simulated for one lap)
export function generateTelemetryData(lapNumber: number) {
  const points = 200;
  const data = [];
  const lapTime = lapData[lapNumber - 1]?.time || 87;

  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    const time = progress * lapTime;

    // Simulate speed based on track position
    let speed =
      180 + Math.sin(progress * Math.PI * 6) * 40 + Math.random() * 10;
    if (progress > 0.15 && progress < 0.25) speed = 80 + Math.random() * 20; // Turn 1
    if (progress > 0.38 && progress < 0.48) speed = 100 + Math.random() * 20; // Turn 2-3
    if (progress > 0.65 && progress < 0.72) speed = 90 + Math.random() * 15; // Turn 4
    if (progress > 0.85 && progress < 0.92) speed = 110 + Math.random() * 20; // Turn 5

    // Simulate G-forces
    const accBrkG =
      -0.3 + Math.sin(progress * Math.PI * 8) * 0.8 + Math.random() * 0.2;
    const corneringG =
      Math.abs(Math.sin(progress * Math.PI * 6)) * 0.5 + Math.random() * 0.1;

    data.push({
      time: formatTime(time),
      timeSeconds: time,
      speed: Math.round(speed * 100) / 100,
      accBrkG: Math.round(accBrkG * 100) / 100,
      corneringG: Math.round(corneringG * 100) / 100,
    });
  }

  return data;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(2, '0')}`;
}

export function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins}:${secs.padStart(5, '0')}`;
}

// Calculate theoretical best lap from best sectors
export function calculateTheoreticalBest() {
  const bestSector1 = Math.min(...lapData.map((l) => l.sector1));
  const bestSector2 = Math.min(...lapData.map((l) => l.sector2));
  const bestSector3 = Math.min(...lapData.map((l) => l.sector3));
  return bestSector1 + bestSector2 + bestSector3;
}

// Calculate session statistics
export function getSessionStats() {
  const maxSpeed = Math.max(...lapData.map((l) => l.maxSpeed));
  const minSpeed = Math.min(...lapData.map((l) => l.minSpeed));
  const maxCorneringG = Math.max(...lapData.map((l) => l.maxCorneringG));
  const minCorneringG = Math.min(...lapData.map((l) => l.maxCorneringG));
  const theoreticalBest = calculateTheoreticalBest();

  // Calculate duration (first lap start to last lap end)
  const totalTime = lapData.reduce((acc, l) => acc + l.time, 0);
  const durationMinutes = Math.round(totalTime / 60);

  return {
    duration: durationMinutes,
    maxSpeed,
    minSpeed,
    maxCorneringG,
    minCorneringG,
    theoreticalBest,
  };
}
