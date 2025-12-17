import type React from 'react';
import type { Metadata } from 'next';
import { ReduxWrapper } from '@/components/redux-wrapper';

export const metadata: Metadata = {
  title: 'Pale Panda Racing Team - Track Sessions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReduxWrapper>{children}</ReduxWrapper>;
}
