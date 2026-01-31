'use client';

import { Separator } from '@/components/ui/separator';
import { NavItem, type NavItems } from '@/lib/data/nav-links';
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

  const isCurrentPage = (link: NavItem) => {
    if (link.altHref === undefined) {
      return pathname.startsWith(link.href);
    }

    return (
      pathname.startsWith(link.href) || pathname.startsWith(link.altHref || '')
    );
  };

  return (
    isNavOpen && (
      <nav
        role='navigation'
        className='md:hidden backdrop-blur-md bg-background/70 absolute top-16 w-dvw h-dvh max-h-dvh z-40 shadow-md'>
        <div className='backdrop-blur-md bg-background/70 rounded-b-md gap-0 w-full h-full p-6'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group block text-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors',
                isCurrentPage(link)
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
              aria-current={isCurrentPage(link) ? 'page' : undefined}
              title={link.title}
              onClick={() => setIsNavOpen(false)}>
              {link.label}
              <Separator
                className={cn(
                  'w-max mt-2 mb-5 h-px opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-radial group-hover:from-primary/80 group-hover:to-transparent',
                  isCurrentPage(link) &&
                    'opacity-100 bg-radial from-primary/80 to-transparent',
                )}
              />
            </Link>
          ))}
        </div>
      </nav>
    )
  );
}
