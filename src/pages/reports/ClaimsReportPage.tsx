import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function ClaimsReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.claims ?? { title: 'Claims Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="claims"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
