import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/footer';
import { ReduxWrapper } from '@/components/redux-wrapper';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
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
  title: {
    template: '%s | Pale Panda Racing Team ',
    default: 'Pale Panda Racing Team',
  },
  description: 'Racing telemetry and }lap analysis',
  applicationName: 'Pale Panda Racing Team Stats',
  keywords: [
    'Pale Panda Racing Team',
    'Pale Panda',
    'Racing',
    'PPR',
    'Telemetry',
    'Lap Analysis',
    'Roadracing',
  ],
  authors: [
    {
      name: 'Pale Panda Racing Team',
      url: 'https://ppr-stats-next.vercel.app/',
    },
  ],
  creator: 'Pale Panda Racing Team',
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
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body
        className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased min-h-svh bg-background flex flex-col`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <ReduxWrapper>
            <Header />
            <Toaster  />
            <main role='main' className='flex-1 w-full'>
              {children}
            </main>
          </ReduxWrapper>
          <Footer />
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
