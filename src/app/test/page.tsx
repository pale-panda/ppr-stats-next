import { requireUser } from '@/auth/require-user';

export default function TestPage() {
  requireUser();
  return <div>Test Page</div>;
}
