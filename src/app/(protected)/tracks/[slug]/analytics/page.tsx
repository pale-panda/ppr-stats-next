import AnalyticsPageClient from '@/app/(protected)/analytics/analytics-page.client';
import { requireUser } from '@/auth/require-user';
import { getAnalyticsData } from '@/services/analytics.service';

export default async function AnalyticsPage(props: PageProps<'/tracks/[slug]/analytics'>) {
  await requireUser();

  const { slug } = await props.params;
  const data = await getAnalyticsData(slug);

  return <AnalyticsPageClient initialData={data} />;
}
