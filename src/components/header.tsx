'use client';

import { HeaderActions } from '@/components/header-actions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { navLinksProtected, navLinksPublic } from '@/lib/data/nav-links';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useAuth();
  const navLinks = auth.isAuthenticated ? navLinksProtected : navLinksPublic;

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

            <nav
              role='navigation'
              className='hidden md:flex items-center justify-between gap-0 md:gap-2 lg:gap-6'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex flex-col group h-16 px-2 lg:px-4 py-5.5 text-sm font-medium hover:text-foreground transition-colors hover:bg-linear-to-b hover:from-transparent hover:to-muted/30',
                    pathname === link.href
                      ? 'bg-linear-to-b from-transparent to-muted/30 text-foreground transition-colors'
                      : 'text-muted-foreground'
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}>
                  {link.label}
                  <Separator className='w-max mt-5 h-px opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-radial group-hover:from-primary/80 group-hover:to-transparent' />
                </Link>
              ))}
            </nav>
          </div>
          {/* Actions */}
          <div className='flex items-center gap-2'>
            <HeaderActions />

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav
            role='navigation'
            className='md:hidden backdrop-blur-md flex items-center bg-background/70 rounded-b-md shadow-md'>
            <div className='backdrop-blur-md bg-background/70 rounded-b-md grid grid-cols-2 gap-0 w-full'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group text-center block p-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors',
                    pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                  <Separator
                    className={cn(
                      'w-max mt-5 h-px opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-radial group-hover:from-primary/80 group-hover:to-transparent',
                      pathname === link.href &&
                        'opacity-100 bg-radial from-primary/80 to-transparent'
                    )}
                  />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
