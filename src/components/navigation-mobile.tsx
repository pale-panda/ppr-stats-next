'use client';

import { Separator } from '@/components/ui/separator';
import { type NavItems } from '@/lib/data/nav-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

interface NavigationMobileProps {
  navLinks: NavItems;
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavigationMobile({
  navLinks,
  isNavOpen,
  setIsNavOpen,
}: NavigationMobileProps) {
  const pathname = usePathname();

  return (
    isNavOpen && (
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
                pathname.startsWith(link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
              aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
              title={link.title}
              onClick={() => setIsNavOpen(false)}>
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
    )
  );
}
