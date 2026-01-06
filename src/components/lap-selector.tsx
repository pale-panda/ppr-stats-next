'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import { type SessionFull } from '@/types';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface LapSelectorProps {
  laps: SessionFull['laps'];
  selectedLap: number;
  onSelectLap: (lap: number) => void;
  comparisonLap: number | null;
  onSelectComparisonLap: (lap: number) => void;
  showComparison: boolean;
  onToggleComparison: (show: boolean) => void;
}

export function LapSelector({
  laps,
  selectedLap,
  onSelectLap,
  comparisonLap,
  onSelectComparisonLap,
  showComparison,
  onToggleComparison,
}: LapSelectorProps) {
  const currentLap = laps.sort((a, b) => a.lapNumber - b.lapNumber)[
    selectedLap - 1
  ];
  const bestLap = laps.reduce(
    (best, lap) =>
      (lap.lapTimeSeconds ? lap.lapTimeSeconds : 0) <
      (best.lapTimeSeconds ? best.lapTimeSeconds : 0)
        ? lap
        : best,
    laps[0]
  );

  const getSectorDelta = (sector: number | null, sectorIndex: 0 | 1 | 2) => {
    if (sector == null)
      return { delta: 0, color: 'text-foreground', icon: Minus };

    const bestSector = Math.min(
      ...laps.map((l) =>
        l.sectors[sectorIndex] > 0
          ? l.sectors[sectorIndex]
          : Number.POSITIVE_INFINITY
      )
    );

    if (!isFinite(bestSector))
      return { delta: 0, color: 'text-foreground', icon: Minus };

    const delta = sector - bestSector;

    if (Math.abs(delta) < 0.01)
      return { delta: 0, color: 'text-foreground', icon: Minus };
    if (delta < 0) return { delta, color: 'text-green-500', icon: TrendingUp };
    return { delta, color: 'text-red-500', icon: TrendingDown };
  };

  return (
    <Card className='bg-card border-border p-4 space-y-4'>
      <div className='space-y-3'>
        <div>
          <Label className='text-xs text-muted-foreground uppercase tracking-wider'>
            Selected Lap
          </Label>
          <Select
            value={selectedLap.toString()}
            onValueChange={(v) => onSelectLap(Number.parseInt(v))}>
            <SelectTrigger className='mt-1.5 bg-secondary border-border'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {laps.map((lap) => (
                <SelectItem
                  key={lap.lapNumber}
                  value={lap.lapNumber.toString()}>
                  <span className='flex items-center gap-2'>
                    <span>Lap {lap.lapNumber}</span>
                    <span className='text-muted-foreground'>
                      {formatLapTime(lap.lapTimeSeconds)}
                    </span>
                    {lap.lapNumber === bestLap.lapNumber && (
                      <span className='text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded'>
                        BEST
                      </span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-between pt-2 border-t border-border'>
          <Label htmlFor='comparison' className='text-sm'>
            Compare Laps
          </Label>
          <Switch
            id='comparison'
            checked={showComparison}
            onCheckedChange={(checked) => {
              onToggleComparison(checked);
              if (checked && !comparisonLap) {
                onSelectComparisonLap(
                  bestLap.lapNumber !== selectedLap
                    ? bestLap.lapNumber
                    : laps[0].lapNumber
                );
              }
            }}
          />
        </div>

        {showComparison && (
          <div>
            <Label className='text-xs text-muted-foreground uppercase tracking-wider'>
              Compare With
            </Label>
            <Select
              value={comparisonLap?.toString() || ''}
              onValueChange={(v) => onSelectComparisonLap(Number.parseInt(v))}>
              <SelectTrigger className='mt-1.5 bg-secondary border-border'>
                <SelectValue placeholder='Select lap to compare' />
              </SelectTrigger>
              <SelectContent>
                {laps
                  .filter((l) => l.lapNumber !== selectedLap)
                  .map((lap) => (
                    <SelectItem
                      key={lap.lapNumber}
                      value={lap.lapNumber.toString()}>
                      <span className='flex items-center gap-2'>
                        <span>Lap {lap.lapNumber}</span>
                        <span className='text-muted-foreground'>
                          {formatLapTime(lap.lapTimeSeconds)}
                        </span>
                        {lap.lapNumber === bestLap.lapNumber && (
                          <span className='text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded'>
                            BEST
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {currentLap && (
        <div className='space-y-3 pt-4 border-t border-border'>
          <div className='text-center'>
            <div className='text-xs text-muted-foreground uppercase tracking-wider'>
              Lap {currentLap.lapNumber} Time
            </div>
            <div className='text-2xl font-mono font-bold text-primary mt-1'>
              {formatLapTime(currentLap.lapTimeSeconds)}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <StatItem
              label='Max Cornering G'
              value={currentLap.maxGForceZ.toFixed(2) || '—'}
            />
            <StatItem
              label='Max Acceleration G'
              value={currentLap.maxGForceX.toFixed(2) || '—'}
            />
            <StatItem
              label='Max Braking G'
              value={currentLap.minGForceX.toFixed(2) || '—'}
            />
            <StatItem
              label='Max Speed'
              value={formatSpeed(currentLap.maxSpeedKmh)}
            />
          </div>

          <div className='space-y-2 pt-3 border-t border-border'>
            <div className='text-xs text-muted-foreground uppercase tracking-wider'>
              Sector Times
            </div>
            {([0, 1, 2] as const).map((sectorIndex) => {
              const sectorTime =
                currentLap.sectors[sectorIndex] > 0
                  ? currentLap.sectors[sectorIndex]
                  : null;
              const {
                delta,
                color,
                icon: Icon,
              } = getSectorDelta(sectorTime, sectorIndex);
              return (
                <div key={sectorIndex} className='grid grid-cols-3 space-y-1'>
                  <span className='text-sm text-muted-foreground'>
                    Sector {sectorIndex + 1}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-sm font-medium'>
                      {formatLapTime(sectorTime)}
                    </span>
                    {delta !== 0 && (
                      <span
                        className={`flex items-center gap-0.5 text-xs ${color}`}>
                        <Icon className='w-3 h-3' />
                        {delta > 0 ? '+' : ''}
                        {delta.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className='text-xs text-muted-foreground'>{label}</div>
      <div className='font-mono text-sm font-medium text-foreground'>
        {value}
      </div>
    </div>
  );
}
