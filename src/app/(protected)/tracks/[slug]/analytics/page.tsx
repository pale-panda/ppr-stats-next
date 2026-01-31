import { requireUser } from '@/auth/require-user';
import { AnalyticsClient } from '@/components/analytics-client';
import { getAnalyticsData } from '@/services/analytics.service';

export default async function AnalyticsPage(
  props: PageProps<'/tracks/[slug]/analytics'>,
) {
  await requireUser();

  const { slug } = await props.params;
  const data = await getAnalyticsData(slug);

  return <AnalyticsClient initialData={data} />;
}
