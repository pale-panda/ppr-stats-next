import { SignupForm } from '@/components/signup-form';

export default function Page() {
  return (
    <section className='flex w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <SignupForm />
      </div>
    </section>
  );
}
