import { SignupForm } from '@/components/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Create your Pale Panda Racing Team account',
  keywords: ['Pale Panda Racing Team', 'Signup', 'Account'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-2 py-8 md:px-10 md:py-10'>
      <div className='mx-auto max-w-sm md:max-w-6xl'>
        <SignupForm />
      </div>
    </section>
  );
}
