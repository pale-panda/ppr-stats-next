import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Get in Touch',
  description: 'Contact the Pale Panda Racing Team for inquiries and support.',
  keywords: ['Pale Panda Racing Team', 'Contact', 'Support'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-xl space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>
            Get in touch
          </h1>
          <p className='text-muted-foreground'>
            Questions, feedback, or support — send us a message.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
