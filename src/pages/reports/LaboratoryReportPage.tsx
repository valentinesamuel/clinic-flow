import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function LaboratoryReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.laboratory ?? { title: 'Laboratory Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="laboratory"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
