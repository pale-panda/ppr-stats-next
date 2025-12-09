'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TelemetryPanelProps {
  sessionId: string;
}

export function TelemetryPanel({ sessionId }: TelemetryPanelProps) {
  return (
    <div className='grid gap-6'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='bg-card border-border/50'>
          <CardContent className='p-4 text-center'>
            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
              RPM
            </p>
            <p className='text-3xl font-mono font-bold text-destructive'>
              14,250
            </p>
            <p className='text-xs text-muted-foreground mt-1'>/ 16,500</p>
            <Progress value={86} className='h-1 mt-2' />
          </CardContent>
        </Card>
        <Card className='bg-card border-border/50'>
          <CardContent className='p-4 text-center'>
            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
              Throttle
            </p>
            <p className='text-3xl font-mono font-bold text-chart-3'>78</p>
            <p className='text-xs text-muted-foreground mt-1'>%</p>
            <Progress value={78} className='h-1 mt-2' />
          </CardContent>
        </Card>
        <Card className='bg-card border-border/50'>
          <CardContent className='p-4 text-center'>
            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
              Lean Angle
            </p>
            <p className='text-3xl font-mono font-bold text-chart-2'>52°</p>
            <p className='text-xs text-muted-foreground mt-1'>right</p>
            <Progress value={87} className='h-1 mt-2' />
          </CardContent>
        </Card>
        <Card className='bg-card border-border/50'>
          <CardContent className='p-4 text-center'>
            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-2'>
              Speed
            </p>
            <p className='text-3xl font-mono font-bold text-primary'>287</p>
            <p className='text-xs text-muted-foreground mt-1'>km/h</p>
            <Progress value={87} className='h-1 mt-2' />
          </CardContent>
        </Card>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <Card className='bg-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-foreground'>Tire Status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-muted-foreground'>Front Tire Temp</span>
                <span className='text-foreground font-mono'>87°C</span>
              </div>
              <Progress value={72} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-muted-foreground'>Rear Tire Temp</span>
                <span className='text-foreground font-mono'>94°C</span>
              </div>
              <Progress value={78} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-muted-foreground'>Front Tire Wear</span>
                <span className='text-foreground font-mono'>82%</span>
              </div>
              <Progress value={82} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-muted-foreground'>Rear Tire Wear</span>
                <span className='text-foreground font-mono'>68%</span>
              </div>
              <Progress value={68} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-muted-foreground'>Tire Compound</span>
                <Badge
                  variant='outline'
                  className='border-primary text-primary'>
                  Soft
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-foreground'>Engine & Brakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <p className='text-xs text-muted-foreground mb-1'>
                  Engine Temp
                </p>
                <p className='text-lg font-mono font-bold text-chart-3'>92°C</p>
                <Badge
                  variant='outline'
                  className='mt-1 border-chart-3 text-chart-3'>
                  Optimal
                </Badge>
              </div>
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <p className='text-xs text-muted-foreground mb-1'>Oil Temp</p>
                <p className='text-lg font-mono font-bold text-chart-4'>
                  108°C
                </p>
                <Badge
                  variant='outline'
                  className='mt-1 border-chart-4 text-chart-4'>
                  Warm
                </Badge>
              </div>
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <p className='text-xs text-muted-foreground mb-1'>
                  Front Brake
                </p>
                <p className='text-lg font-mono font-bold text-primary'>
                  312°C
                </p>
                <Badge
                  variant='outline'
                  className='mt-1 border-primary text-primary'>
                  Hot
                </Badge>
              </div>
              <div className='text-center p-3 bg-muted/30 rounded-lg'>
                <p className='text-xs text-muted-foreground mb-1'>Rear Brake</p>
                <p className='text-lg font-mono font-bold text-chart-2'>
                  245°C
                </p>
                <Badge
                  variant='outline'
                  className='mt-1 border-chart-2 text-chart-2'>
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle className='text-foreground'>
            Suspension & Dynamics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center'>
            <div className='relative w-full max-w-md h-32 border border-border rounded-lg overflow-hidden bg-muted/20'>
              {/* Lean angle visualization */}
              <svg
                viewBox='0 0 400 100'
                className='w-full h-full'
                preserveAspectRatio='none'>
                <defs>
                  <linearGradient
                    id='leanGradient'
                    x1='0%'
                    y1='0%'
                    x2='0%'
                    y2='100%'>
                    <stop
                      offset='0%'
                      stopColor='hsl(var(--primary))'
                      stopOpacity='0.3'
                    />
                    <stop
                      offset='100%'
                      stopColor='hsl(var(--primary))'
                      stopOpacity='0.05'
                    />
                  </linearGradient>
                </defs>
                {/* Lean angle trace over lap */}
                <path
                  d='M0,50 Q25,20 50,50 T100,80 T150,20 T200,50 T250,75 T300,25 T350,50 T400,50'
                  fill='none'
                  stroke='hsl(var(--primary))'
                  strokeWidth='2'
                />
                {/* Center line (neutral) */}
                <line
                  x1='0'
                  y1='50'
                  x2='400'
                  y2='50'
                  stroke='hsl(var(--muted-foreground))'
                  strokeWidth='1'
                  strokeDasharray='4'
                  opacity='0.5'
                />
                {/* Current position indicator */}
                <circle cx='350' cy='50' r='5' fill='hsl(var(--primary))' />
              </svg>
            </div>
            <div className='ml-8 space-y-3'>
              <div>
                <p className='text-xs text-muted-foreground'>Max Lean (Left)</p>
                <p className='text-lg font-mono font-bold text-foreground'>
                  54°
                </p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>
                  Max Lean (Right)
                </p>
                <p className='text-lg font-mono font-bold text-foreground'>
                  52°
                </p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Wheelie Count</p>
                <p className='text-lg font-mono font-bold text-chart-4'>3</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
