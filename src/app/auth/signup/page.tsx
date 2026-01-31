import { SignupForm } from '@/components/signup-form';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Create your Pale Panda Racing Team account',
  keywords: ['Pale Panda Racing Team', 'Signup', 'Account'],
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
      <div className='mx-auto max-w-sm md:max-w-6xl'>
        <SignupForm />
      </div>
    </section>
  );
}
