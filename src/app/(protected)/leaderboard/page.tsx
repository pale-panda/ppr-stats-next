import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'View the Pale Panda Racing Team leaderboard',
  keywords: ['Pale Panda Racing Team', 'Leaderboard', 'Stats'],
};

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <h1>Leaderboard Page</h1>
    </section>
  );
}
