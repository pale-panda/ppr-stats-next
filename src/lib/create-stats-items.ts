import { getAppStats } from '@/lib/data/app.data';

import { StatItem } from '@/types';
import {
  ChartLine,
  MapPinned,
  UploadCloud,
  UserCheck2Icon,
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

export { createAppStats };
