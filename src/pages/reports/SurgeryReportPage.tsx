import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function SurgeryReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.surgery ?? { title: 'Surgery Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="surgery"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
