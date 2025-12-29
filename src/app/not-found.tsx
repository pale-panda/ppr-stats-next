import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftToLine } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-20 px-4 text-center bg-background'>
      <div className='mb-4 flex items-center gap-4'>
        <h1 className='text-4xl font-light mask-radial-to-90%'>404</h1>
        <Separator orientation='vertical' className='min-h-16' />
        <h2 className='text-2xl font-semibold'>Page Not Found</h2>
      </div>
      <p className='text-lg text-muted-foreground mb-8'>
        Oops! The page you are looking for does not exist.
      </p>
      <Link href='/' title='Go to Home'>
        <Button
          variant='outline'
          size='lg'
          className='cursor-pointer hover:bg-accent rounded-md'>
          <ArrowLeftToLine className='inline-block mr-2' />
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
