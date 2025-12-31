'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { FeatureItem } from '@/lib/data/feature-items';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CarouselFeaturesProps {
  items: FeatureItem[];
  current: number;
  setCurrent: (index: number) => void;
}

export function FeaturesCarousel({
  items,
  current,
  setCurrent,
}: CarouselFeaturesProps) {
  const [api, setApi] = useState<CarouselApi>();
  let i = 0;

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(current - 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, current, setCurrent]);

  return (
    <div className='py-4'>
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: false, slidesToScroll: 1 }}
        orientation='vertical'
        className='h-full'>
        <CarouselContent className='-mt-1 -mb-1 h-auto max-h-[45vh] md:max-h-[75vh] w-full'>
          {items.map((f, index) => (
            <div key={index} className='relative'>
              <CarouselItem key={index} className='pt-0 '>
                <div className='p-4'>
                  <Card className='p-0  gap-1 bg-card border-border/50 rounded-lg'>
                    <CardHeader className='pt-4 px-4 pb-0'>
                      <div className='flex flex-wrap gap-2'>
                        {f.keywords.map((keyword) => {
                          if (i < 4) {
                            i++;
                          } else {
                            i = 1;
                          }
                          return (
                            <Badge
                              key={keyword}
                              variant='secondary'
                              className={`bg-chart-${i}/10 font-mono`}>
                              {keyword}
                            </Badge>
                          );
                        })}
                        <Badge
                          variant='secondary'
                          className='hidden md:flex ml-auto'>
                          Slide: {current} / {items.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='px-0'>
                      <div className='w-full h-auto aspect-video relative'>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL}/storage/v1/object/public/assets/app-preview/${f.image}`}
                          alt={f.title}
                          fill
                          className='object-contain'
                          priority={false}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute -top-5' />
        <CarouselNext className='absolute -bottom-10' />
      </Carousel>
    </div>
  );
}
