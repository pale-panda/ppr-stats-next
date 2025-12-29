import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Icon } from 'lucide-react';
import { Badge } from './ui/badge';

interface CarouselFeaturesProps {
  items: {
    title: string;
    description: string;
    image: string;
    keywords: string[];
    icon: typeof Icon;
  }[];
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
      {items.map((f, index) => (
        <Card
          key={index}
          className={cn(
            'bg-card border-border/50',
            current === index + 1 && 'bg-card/50'
          )}
          onClick={() => setCurrent && setCurrent(index + 1)}>
          {' '}
          {/** () => setCurrent && setCurrent(index + 1) */}
          <CardHeader className='py-4'>
            <CardTitle
              className={cn(
                'text-base',
                current === index + 1 && 'text-primary text-2xl'
              )}>
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
                    className={cn(`bg-chart-${i}/10 font-mono cursor-pointer`)}>
                    {k}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
