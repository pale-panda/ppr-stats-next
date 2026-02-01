'use client';

import { LapComparison } from '@/components/lap-comparison';
import { LapSelector } from '@/components/lap-selector';
import { SessionKPIs } from '@/components/session-kpis';
import { TelemetryChart } from '@/components/telemetry-chart';
import TrackMap from '@/components/track-map';
import { DashboardAnalysisSkeleton } from '@/components/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchLapTelemetryQuery } from '@/state/services/track-session';
import { type LatLngLiteral, type SessionFull } from '@/types';
import { use, useMemo, useState } from 'react';

interface DashboardAnalysisProps {
  trackSession: Promise<SessionFull | null>;
}

export function DashboardAnalysis({ trackSession }: DashboardAnalysisProps) {
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [comparisonLap, setComparisonLap] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const session = use(trackSession);

  const {
    data: telemetryData,
    isLoading,
    error,
  } = useFetchLapTelemetryQuery({
    sessionId: session ? session.id : '',
    lapNumber: selectedLap,
  });

  const {
    data: telemetryComparisonData,
    isLoading: comparisonLoading,
    error: comparisonError,
  } = useFetchLapTelemetryQuery({
    sessionId: session ? session.id : '',
    lapNumber: comparisonLap,
  });

  const center = useMemo<LatLngLiteral>(() => {
    const gp = session?.tracks?.gpsPoint as LatLngLiteral | null;
    if (!gp) return { lat: 0, lng: 0 };
    // handle objects and valueOf() shapes, and common key names
    const value = gp as LatLngLiteral;
    const lat = Number(value?.lat ?? 0);
    const lng = Number(value?.lng ?? 0);
    return { lat, lng };
  }, [session?.tracks?.gpsPoint]);

  const handleSelectComparisonLap = (lap: number) => {
    setComparisonLap(lap);
  };

  if (!session || !session.laps) {
    return <div>Session not found.</div>;
  }

  const { id, laps, tracks } = session;
  if (!tracks || !laps || !id) {
    return <div>Session data is incomplete.</div>;
  }

  if (error || comparisonError || isLoading || comparisonLoading) {
    return <DashboardAnalysisSkeleton />;
  }

  return (
    <div className='flex flex-col'>
      {session && <SessionKPIs {...session} />}
      <div className='flex-1 py-4 lg:py-6 space-y-4 lg:space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6'>
          <div className='lg:col-span-3'>
            <LapSelector
              laps={laps}
              selectedLap={selectedLap}
              onSelectLap={setSelectedLap}
              comparisonLap={comparisonLap}
              onSelectComparisonLap={handleSelectComparisonLap}
              showComparison={showComparison}
              onToggleComparison={setShowComparison}
            />
          </div>

          <div className='lg:col-span-9'>
            <TrackMap
              telemetry={telemetryData ?? []}
              telemetryComparison={telemetryComparisonData ?? []}
              comparisonLap={comparisonLap}
              showComparison={showComparison}
              center={center}
            />
          </div>
        </div>

        {showComparison && comparisonLap ? (
          <LapComparison
            lap1={selectedLap}
            lap2={comparisonLap}
            laps={session.laps}
            telemetry1={telemetryData}
            telemetry2={telemetryComparisonData}
          />
        ) : (
          <TelemetryChart
            selectedLap={selectedLap}
            laps={session.laps}
            telemetry={telemetryData}
          />
        )}
      </div>
      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle className='text-foreground'>Session Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Detailed performance analysis and AI-powered insights for this
            session will be available here. Compare lap times, identify areas
            for improvement, and track your progress over time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
