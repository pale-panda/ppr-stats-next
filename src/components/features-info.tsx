import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FeatureItem } from '@/lib/data/feature-items';
import { cn } from '@/lib/utils';

interface CarouselFeaturesProps {
  items: FeatureItem[];
  current?: number;
  setCurrent?: (index: number) => void;
}

export function FeaturesInfo({
  items,
  current,
  setCurrent,
}: CarouselFeaturesProps) {
  let i = 0;
  return (
    <div className='grid gap-4'>
      {items.map((f, index) => {
        const Icon = f.icon ?? f.icon;
        return (
          <Card
            key={index}
            className={cn(
              'bg-card border-border/50',
              current === index + 1 && 'bg-card/50'
            )}
            onClick={() => setCurrent && setCurrent(index + 1)}>
            <CardHeader className='py-4'>
              <CardTitle
                className={cn(
                  'text-base flex items-center gap-2',
                  current === index + 1 && 'text-primary text-2xl'
                )}>
                <Icon
                  className={cn(
                    current === index + 1 && 'w-8 h-8',
                    `text-chart-${i + 1}`
                  )}
                />
                {f.title}
              </CardTitle>
              <CardDescription
                className={cn(
                  'text-sm',
                  current === index + 1 && 'text-foreground text-base'
                )}>
                {f.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {f.keywords.map((k, index) => {
                  if (i < 4) {
                    i++;
                  } else {
                    i = 1;
                  }
                  return (
                    <Badge
                      key={index}
                      variant='secondary'
                      className={cn(
                        `bg-chart-${i}/10 font-mono cursor-pointer`
                      )}>
                      {k}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
