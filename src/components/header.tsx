'use client';

import { HeaderActions } from '@/components/header-actions';
import { Logotype } from '@/components/logotype';
import { Navigation } from '@/components/navigation';
import { NavigationMobile } from '@/components/navigation-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  NavItem,
  filterNavLinksByRole,
  navLinksProtected,
  navLinksPublic,
} from '@/lib/data/nav-links';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useAuth();
  const navLinks = user?.isAuthenticated
    ? filterNavLinksByRole(navLinksProtected, user?.role)
    : navLinksPublic;
  const pathname = usePathname();

  const isCurrentPage = (link: NavItem) => {
    if (link.href === '/') {
      return pathname === link.href;
    }
    if (link.altHref === '/') {
      return pathname === link.altHref || pathname === '/home';
    }
    if (link.altHref) {
      return (
        pathname.startsWith(link.href) ||
        pathname.startsWith(link.altHref || '')
      );
    }
    return pathname.startsWith(link.href);
  };

  return (
    <>
      <header
        role='banner'
        className='h-16 sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
        <div className='container mx-auto px-4'>
          <div className='relative flex items-center justify-between h-16'>
            <div className='flex items-center gap-6 h-16'>
              {/* Logo */}
              <Link
                href='/'
                className='flex items-center gap-3 no-underline rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                aria-label='Go to homepage'>
                <Logotype />
              </Link>

              {/* Desktop Nav */}
              <Navigation navLinks={navLinks} isCurrentPage={isCurrentPage} />
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
        </div>
        {/* Mobile Nav */}
      </header>
      <NavigationMobile
        navLinks={navLinks}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        isCurrentPage={isCurrentPage}
      />
    </>
  );
}
