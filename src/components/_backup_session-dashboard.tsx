'use client';

import { useState } from 'react';
import { SessionHeader } from '@/components/session-header';
import { SessionKPIs } from '@/components/session-kpis';
import { LapSelector } from '@/components/lap-selector';
import { TrackMap } from '@/components/track-map';
import { TelemetryChart } from '@/components/telemetry-chart';
import { LapComparison } from '@/components/lap-comparison';
import { sessionInfo, lapData, getSessionStats } from '@/lib/sessions-data';

export function SessionDashboard() {
  const [selectedLap, setSelectedLap] = useState(5); // Best lap
  const [comparisonLap, setComparisonLap] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const stats = getSessionStats();
  const currentLapData = lapData[selectedLap - 1];

  return (
    <div className='flex flex-col min-h-screen'>
      <SessionHeader
        sessionInfo={sessionInfo}
        bestLapTime={sessionInfo.bestLapTime}
      />

      <div className='flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6'>
        <SessionKPIs stats={stats} sessionInfo={sessionInfo} />

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6'>
          <div className='lg:col-span-3'>
            <LapSelector
              laps={lapData}
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
              selectedLap={selectedLap}
              comparisonLap={comparisonLap}
              showComparison={showComparison}
            />
          </div>
        </div>

        {showComparison && comparisonLap ? (
          <LapComparison
            lap1={selectedLap}
            lap2={comparisonLap}
            lapData={lapData}
          />
        ) : (
          <TelemetryChart selectedLap={selectedLap} lapData={currentLapData} />
        )}
      </div>
    </div>
  );
}
