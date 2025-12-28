'use client';

import { useMemo, useState } from 'react';
import { SessionKPIs } from '@/components/session-kpis';
import { LapSelector } from '@/components/lap-selector';
import TrackMap from '@/components/track-map';
import { TelemetryChart } from '@/components/telemetry-chart';
import { LapComparison } from '@/components/lap-comparison';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Telemetry, TrackSessionJoined } from '@/types';
import { useFetchLapTelemetryQuery } from '@/state/services/track-session';

interface DashboardAnalysisProps {
  trackSession: TrackSessionJoined;
}

export function DashboardAnalysis({ trackSession }: DashboardAnalysisProps) {
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [comparisonLap, setComparisonLap] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const {
    data: mainTelemetry,
    isLoading,
    error,
  } = useFetchLapTelemetryQuery({
    sessionId: trackSession.id,
    lapNumber: selectedLap,
  });

  const telemetry = useMemo(() => {
    if (isLoading || !mainTelemetry) {
      return [] as Telemetry;
    }
    return mainTelemetry;
  }, [isLoading, mainTelemetry]);

  const handleSelectComparisonLap = (lap: number) => {
    setComparisonLap(lap);
  };

  if (!trackSession || !trackSession.laps) {
    return <div>Session not found.</div>;
  }

  if (isLoading) {
    return <div>Loading telemetry data...</div>;
  }

  if (error) {
    return <div>Error loading telemetry data.</div>;
  }

  return (
    <div className='flex flex-col'>
      {trackSession && <SessionKPIs {...trackSession} />}
      <div className='flex-1 py-4 lg:py-6 space-y-4 lg:space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6'>
          <div className='lg:col-span-3'>
            <LapSelector
              laps={trackSession.laps}
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
              sessionId={trackSession.id}
              telemetry={telemetry}
              selectedLap={selectedLap}
              comparisonLap={comparisonLap}
              showComparison={showComparison}
              center={{
                ...trackSession.track?.gps_point,
              }}
            />
          </div>
        </div>

        {showComparison && comparisonLap ? (
          <LapComparison
            lap1={selectedLap}
            lap2={comparisonLap}
            laps={trackSession.laps}
          />
        ) : (
          <TelemetryChart
            selectedLap={selectedLap}
            laps={trackSession.laps}
            telemetry={telemetry}
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
