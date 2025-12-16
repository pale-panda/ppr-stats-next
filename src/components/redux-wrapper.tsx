'use client';
import { Provider } from 'react-redux';
import { store } from '@/state/store';

export function ReduxWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
