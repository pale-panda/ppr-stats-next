import AnalyticsPageClient from '@/app/(protected)/analytics/analytics-page.client';
import { requireUser } from '@/auth/require-user';
import { getAnalyticsData } from '@/services/analytics.service';

export default async function AnalyticsPage() {
  await requireUser();
  const data = await getAnalyticsData();

  return <AnalyticsPageClient initialData={data} />;
}
