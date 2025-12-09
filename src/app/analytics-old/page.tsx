import { SessionDashboard } from '@/components/session-dashboard';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Pale Panda Racing Team - Telemetry Dashboard',
  description: 'Racing telemetry and lap analysis dashboard',
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
};

export default function Home() {
  return (
    <main className='min-h-screen bg-background'>
      <SessionDashboard />
    </main>
  );
}
