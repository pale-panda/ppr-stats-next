import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/footer';
import { ReduxWrapper } from '@/components/redux-wrapper';
import { navLinks } from '@/lib/data/nav-links';
import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import './globals.css';

const _geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const _geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pale Panda Racing Team - Home',
  description: 'Racing telemetry and lap analysis',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error fetching session in layout:', error.message);
  }

  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body
        className={`${_geist.variable} ${_geistMono.variable}  font-sans antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <ReduxWrapper>
            <div className='min-h-screen bg-background'>
              <Header
                navLinks={
                  session && session.user ? navLinks.protected : navLinks.public
                }
              />
              {children}
            </div>
          </ReduxWrapper>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
