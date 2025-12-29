import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StatItem, StatsType } from '@/types';
import { use } from 'react';

const createStatCard = (stat: StatItem, index: number) => {
  const Icon = stat.icon || (() => null);

  return (
    <Card className='bg-card border-border/50' key={index}>
      <CardContent className='px-6 sm:px-6'>
        <div className='flex items-center justify-between mb-2 sm:mb-0'>
          <p className='text-xs text-muted-foreground uppercase tracking-wider text-nowrap'>
            {stat.label}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-2xl font-mono font-bold mt-1'>
              {stat.value}{' '}
              {stat.unit ? (
                <span className='text-sm text-muted-foreground'>
                  {stat.unit}
                </span>
              ) : (
                ''
              )}
            </p>
          </div>
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              index === 0 && 'bg-chart-1/10',
              index === 1 && 'bg-chart-2/10',
              index === 2 && 'bg-chart-3/10',
              index === 3 && 'bg-chart-4/10'
            )}>
            <Icon
              className={cn(
                'w-5 h-5',
                index === 0 && 'text-chart-1',
                index === 1 && 'text-chart-2',
                index === 2 && 'text-chart-3',
                index === 3 && 'text-chart-4'
              )}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className='text-xs text-muted-foreground'>{stat.sublabel}</p>
      </CardFooter>
    </Card>
  );
};

interface StatsBarProps {
  type: StatsType;
  statItems: Promise<StatItem[]>;
}

export function StatsBar({ ...props }: StatsBarProps) {
  const stats = use(props.statItems);
  return (
    <section className='border-b border-border bg-card/50'>
      <div className='px-4 py-8 container mx-auto  grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-border'>
        {stats.map((stat, index) => createStatCard(stat, index))}
      </div>
    </section>
  );
}
