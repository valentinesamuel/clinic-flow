import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function ClaimsReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.claims ?? { title: 'Claims Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="claims"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
