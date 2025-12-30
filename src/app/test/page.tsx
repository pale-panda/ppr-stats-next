import { requireUser } from '@/lib/data/require-user';

export default function TestPage() {
  requireUser();
  return <div>Test Page</div>;
}