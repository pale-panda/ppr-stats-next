'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatLapTime } from '@/lib/sessions-data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LapData {
  lap: number;
  time: number;
  sector1: number;
  sector2: number;
  sector3: number;
  maxSpeed: number;
  minSpeed: number;
  maxCorneringG: number;
  maxAccelG: number;
  maxBrakingG: number;
}

interface LapSelectorProps {
  laps: LapData[];
  selectedLap: number;
  onSelectLap: (lap: number) => void;
  comparisonLap: number | null;
  onSelectComparisonLap: (lap: number | null) => void;
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
  const currentLap = laps[selectedLap - 1];
  const bestLap = laps.reduce(
    (best, lap) => (lap.time < best.time ? lap : best),
    laps[0]
  );

  const getSectorDelta = (
    sector: number,
    sectorKey: 'sector1' | 'sector2' | 'sector3'
  ) => {
    const bestSector = Math.min(...laps.map((l) => l[sectorKey]));
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
                <SelectItem key={lap.lap} value={lap.lap.toString()}>
                  <span className='flex items-center gap-2'>
                    <span>Lap {lap.lap}</span>
                    <span className='text-muted-foreground'>
                      {formatLapTime(lap.time)}
                    </span>
                    {lap.lap === bestLap.lap && (
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
                  bestLap.lap !== selectedLap ? bestLap.lap : laps[0].lap
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
                  .filter((l) => l.lap !== selectedLap)
                  .map((lap) => (
                    <SelectItem key={lap.lap} value={lap.lap.toString()}>
                      <span className='flex items-center gap-2'>
                        <span>Lap {lap.lap}</span>
                        <span className='text-muted-foreground'>
                          {formatLapTime(lap.time)}
                        </span>
                        {lap.lap === bestLap.lap && (
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
              Lap {currentLap.lap} Time
            </div>
            <div className='text-2xl font-mono font-bold text-primary mt-1'>
              {formatLapTime(currentLap.time)}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <StatItem
              label='Max Cornering G'
              value={currentLap.maxCorneringG.toFixed(2)}
            />
            <StatItem
              label='Max Acceleration G'
              value={currentLap.maxAccelG.toFixed(2)}
            />
            <StatItem
              label='Max Braking G'
              value={currentLap.maxBrakingG.toFixed(2)}
            />
            <StatItem
              label='Max Speed'
              value={`${currentLap.maxSpeed.toFixed(2)} kph`}
            />
            <StatItem
              label='Min Speed'
              value={`${currentLap.minSpeed.toFixed(2)} kph`}
            />
          </div>

          <div className='space-y-2 pt-3 border-t border-border'>
            <div className='text-xs text-muted-foreground uppercase tracking-wider'>
              Sector Times
            </div>
            {(['sector1', 'sector2', 'sector3'] as const).map(
              (sectorKey, index) => {
                const {
                  delta,
                  color,
                  icon: Icon,
                } = getSectorDelta(currentLap[sectorKey], sectorKey);
                return (
                  <div
                    key={sectorKey}
                    className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Sector {index + 1}
                    </span>
                    <div className='flex items-center gap-2'>
                      <span className='font-mono text-sm font-medium'>
                        {formatLapTime(currentLap[sectorKey])}
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
              }
            )}
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
