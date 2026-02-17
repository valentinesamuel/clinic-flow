import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function ExecutiveReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.executive ?? { title: 'Executive Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="executive"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
