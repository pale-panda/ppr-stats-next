import AccountForm from '@/components/account-form';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className='container mx-auto px-4 py-8'>
      <AccountForm user={user} />
    </section>
  );
}
