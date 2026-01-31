import { MessagesClient } from '@/components/messages/messages-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Direct messages for the Pale Panda Racing Team',
};

export default function MessagesPage() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Team Messages</h1>
        <p className='text-muted-foreground mt-1'>
          Chat privately with your teammates.
        </p>
      </div>
      <MessagesClient />
    </section>
  );
}
