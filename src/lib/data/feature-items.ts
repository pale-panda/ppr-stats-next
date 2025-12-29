import { BarChartBig, Gauge, Shield, Target } from 'lucide-react';

export type FeatureItem = {
  title: string;
  description: string;
  image: string;
  keywords: string[];
  icon: React.ElementType;
};

export const featureItems: FeatureItem[] = [
  {
    title: 'Quick Insights',
    description:
      'See key figures and trends instantly – built to provide a clear overall picture.',
    image: 'app-preview-sessions.png',
    keywords: ['insights', 'overview', 'summary'],
    icon: Gauge,
  },
  {
    title: 'Understand Results',
    description:
      'Break down statistics per session and compare development over time to find improvements.',
    image: 'app-preview-sessions-dashboard.png',
    keywords: ['analysis', 'comparison', 'development'],
    icon: BarChartBig,
  },
  {
    title: 'Focus on the Next Step',
    description:
      'Identify what makes the biggest difference and track the effect after each change.',
    image: 'app-preview-sessions-id.png',
    keywords: ['improvement', 'changes', 'tracking'],
    icon: Target,
  },
  {
    title: 'Your Data, Your Control',
    description:
      'All data is stored securely and privately. You decide who has access.',
    image: 'app-preview-upload.png',
    keywords: ['privacy', 'security', 'control'],
    icon: Shield,
  },
];
