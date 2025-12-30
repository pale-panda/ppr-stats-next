import { Button } from '@/components/ui/button';
import { BarChart3, Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className='relative min-h-[60vh] flex items-center justify-center overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src='/dramatic-lighting-roadracing.png'
          alt='Racing hero'
          className='w-full h-full object-cover'
          width='1920'
          height='1080'
        />
        <div className='absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/40' />
        <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-background/50' />
      </div>

      {/* Content */}
      <div className='relative z-10 container mx-auto px-4 py-20'>
        <div className='max-w-2xl'>
          <p className='text-primary font-mono text-sm uppercase tracking-widest mb-4'>
            Racing Analytics Platform
          </p>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance'>
            Track Your Performance
          </h1>
          <p className='text-lg text-muted-foreground mb-8 leading-relaxed'>
            Real-time telemetry, lap analysis, and comprehensive session data to
            help you find those extra tenths on the track.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button size='lg' asChild>
              <Link href='/upload'>
                <Upload className='w-5 h-5 mr-2' />
                Upload New Session
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href='/analytics' passHref>
                <BarChart3 className='w-5 h-5 mr-2' />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
