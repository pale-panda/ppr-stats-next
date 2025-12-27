import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import { getAppStats } from '@/lib/data/app.data';
import { getDashboardStats } from '@/lib/data/track-session.data';

import {
  UserCheck2Icon,
  MapPinned,
  UploadCloud,
  ChartLine,
  Zap,
  Gauge,
  Clock,
  Flag,
} from 'lucide-react';
import { StatItem } from '@/types';

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

const createDashboardStats = async () => {
  const data = await getDashboardStats();

  const statsList: StatItem[] = [
    {
      label: 'Best Lap',
      value: formatLapTime(data.bestLapTime),
      sublabel: '',
      icon: Zap,
    },
    {
      label: 'Top Speed',
      value: formatSpeed(data.topSpeed, { showUnit: false }),
      sublabel: 'km/h',
      icon: Gauge,
    },
    {
      label: 'Sessions',
      value: data.totalSessions,
      sublabel: '',
      icon: Clock,
    },
    {
      label: 'Total Laps',
      value: data.totalLaps,
      sublabel: '',
      icon: Flag,
    },
  ];

  return statsList;
};

export { createAppStats, createDashboardStats };
