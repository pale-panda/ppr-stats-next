import { LoginForm } from '@/components/login-form';

export default function Page() {
  return (
    <section className='container mx-auto px-2 py-2 md:px-10 md:py-10'>
      <div className='mx-auto max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </section>
  );
}
