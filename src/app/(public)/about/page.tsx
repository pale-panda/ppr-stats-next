import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about the Pale Panda Racing Team and our mission.',
  keywords: ['Pale Panda Racing Team', 'About', 'Mission'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <h1>About Page</h1>
    </section>
  );
}
