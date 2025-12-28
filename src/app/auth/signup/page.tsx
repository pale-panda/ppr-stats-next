import { SignupForm } from '@/components/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Create your Pale Panda Racing Team account',
  keywords: ['Pale Panda Racing Team', 'Signup', 'Account'],
};

export default function Page() {
  return (
    <section className='flex w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <SignupForm />
      </div>
    </section>
  );
}
