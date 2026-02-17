import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function NursingReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.nursing ?? { title: 'Nursing Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="nursing"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
