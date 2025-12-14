'use client';

import { useState, useEffect } from 'react';
import { SessionKPIs } from '@/components/session-kpis';
import { LapSelector } from '@/components/lap-selector';
import TrackMap from '@/components/track-map';
import { TelemetryChart } from '@/components/telemetry-chart';
import { LapComparison } from '@/components/lap-comparison';
import { TelemetryPoints, TrackSession } from '@/lib/types/response';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SessionDashboardProps {
  trackSessionData: TrackSession;
}

export function SessionDashboard({ trackSessionData }: SessionDashboardProps) {
  const { track, laps, ...trackSession } = trackSessionData;
  const [selectedLap, setSelectedLap] = useState(1);
  const [comparisonLap, setComparisonLap] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const {
    data: lapTelemetry,
    error,
    isLoading,
  } = useSWR<TelemetryPoints>(
    `/api/sessions/${trackSession.id}/telemetry?lap=${selectedLap}`,
    fetcher
  );

  if (!trackSession || isLoading) return <div>Loading Session Data...</div>;
  if (error) return <div>Error loading telemetry data.</div>;

  return (
    <div className='flex flex-col min-h-screen'>
      {trackSession && <SessionKPIs {...trackSession} />}
      <div className='flex-1 py-4 lg:py-6 space-y-4 lg:space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6'>
          <div className='lg:col-span-3'>
            <LapSelector
              laps={laps}
              selectedLap={selectedLap}
              onSelectLap={setSelectedLap}
              comparisonLap={comparisonLap}
              onSelectComparisonLap={setComparisonLap}
              showComparison={showComparison}
              onToggleComparison={setShowComparison}
            />
          </div>

          <div className='lg:col-span-9'>
            <TrackMap
              telemetry={lapTelemetry}
              selectedLap={selectedLap}
              comparisonLap={comparisonLap}
              showComparison={showComparison}
              center={{
                ...track.point,
              }}
            />
          </div>
        </div>

        {showComparison && comparisonLap ? (
          <LapComparison lap1={selectedLap} lap2={comparisonLap} laps={laps} />
        ) : (
          <TelemetryChart
            selectedLap={selectedLap}
            laps={laps}
            telemetry={lapTelemetry}
          />
        )}
      </div>
    </div>
  );
}
