import { getAppStats } from '@/lib/data/app.data';
import { getDashboardStats } from '@/lib/data/track-session.data';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';

import { StatItem } from '@/types';
import {
  ChartLine,
  Clock,
  Flag,
  Gauge,
  MapPinned,
  UploadCloud,
  UserCheck2Icon,
  Zap,
} from 'lucide-react';

const createAppStats = async () => {
  const data = await getAppStats();

  const statsList: StatItem[] = [
    {
      label: 'Total Sessions',
      value: data.totalSessions,
      sublabel: 'Uploaded to date',
      icon: UploadCloud,
    },
    {
      label: 'Total Laps',
      value: data.totalLaps,
      sublabel: 'Completed so far',
      icon: ChartLine,
    },
    {
      label: 'Total Tracks',
      value: data.totalTracks,
      sublabel: 'Available in the app',
      icon: MapPinned,
    },
    {
      label: 'Total Users',
      value: data.totalUsers,
      sublabel: 'Registered riders',
      icon: UserCheck2Icon,
    },
  ];

  return statsList;
};

const createDashboardStats = async (query?: {
  [key: string]: string | string[];
}) => {
  const params = query ? query : {};
  const data = await getDashboardStats(params);

  const statsList: StatItem[] = [
    {
      label: 'Best Lap',
      value: formatLapTime(data.bestLapTime.lapTimeSeconds),
      sublabel: data.bestLapTime.trackName || '',
      icon: Zap,
    },
    {
      label: 'Top Speed',
      value: formatSpeed(data.topSpeed.maxSpeedKmh, { showUnit: false }),
      unit: 'km/h',
      sublabel: data.topSpeed.trackName || '',
      icon: Gauge,
    },
    {
      label: 'Sessions',
      value: data.totalSessions,
      sublabel: 'At the selected tracks',
      icon: Clock,
    },
    {
      label: 'Total Laps',
      value: data.totalLaps,
      sublabel: 'At the selected tracks',
      icon: Flag,
    },
  ];

  return statsList;
};

export { createAppStats, createDashboardStats };
