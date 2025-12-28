import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get in Touch',
  description: 'Contact the Pale Panda Racing Team for inquiries and support.',
  keywords: ['Pale Panda Racing Team', 'Contact', 'Support'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <h1>Contact Page</h1>
    </section>
  );
}
