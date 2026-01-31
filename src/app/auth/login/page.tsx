import { LoginForm } from '@/components/login-form';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Access your Pale Panda Racing Team account',
  keywords: ['Pale Panda Racing Team', 'Login', 'Account'],
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/home');
  }

  return (
    <section className='container mx-auto px-2 py-8 md:px-10 md:py-10'>
      <div className='mx-auto max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </section>
  );
}
