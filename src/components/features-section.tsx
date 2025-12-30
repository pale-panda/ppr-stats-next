'use client';
import { FeaturesCarousel } from '@/components/features-carousel';
import { FeaturesInfo } from '@/components/features-info';
import { featureItems } from '@/lib/data/feature-items';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';

export function FeaturesSection() {
  const [current, setCurrent] = useState(1);

  return (
    <div className='grid gap-6 md:grid-cols-3 md:gap-10 items-stretch'>
      <div className='md:col-span-2 flex flex-col gap-6'>
        <div className='space-y-5'>
          <h2 className='flex flex-col md:block text-center text-2xl md:text-3xl font-bold text-foreground'>
            <span>Welcome to</span>{' '}
            <span className='mx-4 text-4xl'>
              <span className='text-foreground'>PALE</span>{' '}
              <span className='text-primary'>PANDA</span>
            </span>{' '}
            <span>Racing Team!</span>
          </h2>
          <p className='text-muted-foreground leading-relaxed text-balance md:text-center'>
            Explore our app designed to help racing enthusiasts analyze and
            improve their performance. Whether you&apos;re a driver, engineer,
            or team manager, our tools provide valuable insights to take your
            racing to the next level.
          </p>
        </div>
        {/* Left: image/preview */}
        <FeaturesCarousel
          items={featureItems}
          current={current}
          setCurrent={setCurrent}
        />
      </div>
      {/* Right: text */}
      <div className='flex flex-col justify-center pt-6 md:pt-0'>
        <div className='space-y-6'>
          <h2 className='text-2xl md:text-3xl font-bold text-center'>
            App Features
          </h2>
          <p className='leading-relaxed'>
            Our app is designed to provide quick insights, help you understand
            results, and focus on the next steps for improvement. With secure
            data storage, you have full control over your information.
          </p>
          <FeaturesInfo
            items={featureItems}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
        <div className='mt-6 flex flex-col sm:flex-row gap-3'>
          <Button asChild>
            <Link href='/auth/signup'>Register account</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/contact'>Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
