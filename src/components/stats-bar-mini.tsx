import { cn } from '@/lib/utils';
import { StatItem, StatsType } from '@/types';
import { use } from 'react';

const createStatCardMini = (stat: StatItem, index: number) => {
  const Icon = stat.icon || (() => null);

  return (
    <div className='text-center' key={index}>
      <div className='flex flex-col items-center justify-center mx-auto text-accent'>
        <p className='text-3xl font-bold text-foreground mb-2'>
          {stat.value}{' '}
          {stat.unit ? (
            <span className='text-sm text-muted-foreground'>{stat.unit}</span>
          ) : (
            ''
          )}
        </p>

        <div className='relative w-full'>
          <p className='text-md text-muted-foreground'>{stat.label}</p>
          <p className='text-xs text-muted-foreground'>{stat.sublabel}</p>
          <div
            className={cn(
              'w-20 h-20 md:h-10 md:w-10  rounded-lg flex items-center justify-center absolute -top-12 md:top-0  md:right-auto right-1/2 transform translate-x-1/2',
              index === 0 && 'bg-chart-1/5 md:bg-chart-1/10',
              index === 1 && 'bg-chart-2/5 md:bg-chart-2/10',
              index === 2 && 'bg-chart-3/5 md:bg-chart-3/10',
              index === 3 && 'bg-chart-4/5 md:bg-chart-4/10'
            )}>
            <Icon
              className={cn(
                'w-5 h-5',
                index === 0 && 'text-chart-1/10 md:text-chart-1',
                index === 1 && 'text-chart-2/10 md:text-chart-2',
                index === 2 && 'text-chart-3/10 md:text-chart-3',
                index === 3 && 'text-chart-4/10 md:text-chart-4'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsBarProps {
  type: StatsType;
  statItems: Promise<StatItem[]>;
}

export function StatsBarMini({ ...props }: StatsBarProps) {
  const stats = use(props.statItems);

  return (
    <section className='py-8 border-b border-border bg-card/50'>
      <div className='container mx-auto px-4'>
        <div className='h-full grid grid-cols-2 md:grid-cols-4 gap-4'>
          {stats.map((stat, index) => createStatCardMini(stat, index))}
        </div>
      </div>
    </section>
  );
}
