import { LoginForm } from '@/components/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Access your Pale Panda Racing Team account',
  keywords: ['Pale Panda Racing Team', 'Login', 'Account'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-2 py-2 md:px-10 md:py-10'>
      <div className='mx-auto max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </section>
  );
}
