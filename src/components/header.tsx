'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Settings, User } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Sessions' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/tracks', label: 'Tracks' },
  { href: '/upload', label: 'Upload' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='w-12 h-12 bg-primary rounded-sm flex items-center justify-center'>
              <Image
                src='/ppr-logotype-dark.png'
                alt='Pale Panda Racing Logo'
                width={100}
                height={100}
              />
            </div>
            <div className='flex flex-col leading-tight'>
              <span className='font-bold text-lg text-foreground'>
                PALE <span className='text-primary'>PANDA</span>
              </span>
              <span className=''>Racing Team</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center gap-1'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' className='hidden md:flex'>
              <Settings className='w-5 h-5' />
            </Button>
            <Button variant='ghost' size='icon' className='hidden md:flex'>
              <User className='w-5 h-5' />
            </Button>
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
          <nav className='md:hidden py-4 border-t border-border'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors'
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
