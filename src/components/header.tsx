'use client';

import { HeaderActions } from '@/components/header-actions';
import { Navigation } from '@/components/navigation';
import { NavigationMobile } from '@/components/navigation-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { navLinksProtected, navLinksPublic } from '@/lib/data/nav-links';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useAuth();
  const navLinks = user?.isAuthenticated ? navLinksProtected : navLinksPublic;

  return (
    <header
      role='banner'
      className='h-16 sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
      <div className='container mx-auto px-4'>
        <div className='relative flex items-center justify-between h-16'>
          <div className='flex items-center gap-6 h-16'>
            {/* Logo */}
            <Link href='/' className='flex-none flex items-center gap-2'>
              <div className='w-12 h-12 bg-primary rounded-sm flex items-center justify-center'>
                <Image
                  src='/ppr-logotype-dark.png'
                  alt='Pale Panda Racing Logo'
                  width={100}
                  height={100}
                />
              </div>
              <div className='flex flex-col leading-tight'>
                <span className='font-bold text-md text-nowrap text-foreground'>
                  PALE <span className='text-primary'>PANDA</span>
                </span>
                <span className='text-nowrap text-foreground'>Racing Team</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <Navigation navLinks={navLinks} />
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <HeaderActions user={user} />

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={() => setIsNavOpen(!isNavOpen)}>
              {isNavOpen ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <NavigationMobile
          navLinks={navLinks}
          isNavOpen={isNavOpen}
          setIsNavOpen={setIsNavOpen}
        />
      </div>
    </header>
  );
}
