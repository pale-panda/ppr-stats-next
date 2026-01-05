import { DashboardAnalysis } from '@/components/dashboard-analysis';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardOverview } from '@/components/dashboard-overview';
import { TelemetryPanel } from '@/components/telemetry-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSessionByIdFull } from '@/services/sessions.service';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your Pale Panda Racing Team dashboard',
  keywords: ['Pale Panda Racing Team', 'Dashboard'],
};

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  const trackSession = getSessionByIdFull(id);

  return (
    <>
      {/* Dashboard Header */}
      <Suspense
        fallback={<div>{/** TODO: Implement skeleton! */}Loading...</div>}>
        <DashboardHeader trackSession={trackSession} />
      </Suspense>
      <div className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='bg-card border border-border'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='telemetry'>Telemetry</TabsTrigger>
            <TabsTrigger value='analysis'>Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <Suspense
              fallback={
                <div>{/** TODO: Implement skeleton! */}Loading...</div>
              }>
              <DashboardOverview trackSession={trackSession} />
            </Suspense>
          </TabsContent>

          <TabsContent value='telemetry'>
            <Suspense
              fallback={
                <div>{/** TODO: Implement skeleton! */}Loading...</div>
              }>
              <TelemetryPanel trackSession={trackSession} />
            </Suspense>
          </TabsContent>

          <TabsContent value='analysis'>
            <Suspense
              fallback={
                <div>{/** TODO: Implement skeleton! */}Loading...</div>
              }>
              <DashboardAnalysis trackSession={trackSession} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
