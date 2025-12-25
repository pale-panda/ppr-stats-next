import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TelemetryPanel } from '@/components/telemetry-panel';
import { DashboardAnalysis } from '@/components/dashboard-analysis';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardOverview } from '@/components/dashboard-overview';
import { getTrackSessionWithStats } from '@/lib/data/track-session.data';
import { notFound } from 'next/navigation';

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  const trackSession = await getTrackSessionWithStats(id);

  if (!trackSession) {
    notFound();
  }

  return (
    <>
      {/* Dashboard Header */}
      <DashboardHeader trackSession={trackSession} />

      <div className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='bg-card border border-border'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='telemetry'>Telemetry</TabsTrigger>
            <TabsTrigger value='analysis'>Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <DashboardOverview trackSession={trackSession} />
          </TabsContent>

          <TabsContent value='telemetry'>
            <TelemetryPanel trackSession={trackSession} />
          </TabsContent>

          <TabsContent value='analysis'>
            <DashboardAnalysis trackSession={trackSession} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
