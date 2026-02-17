import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function PharmacyReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.pharmacy ?? { title: 'Pharmacy Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="pharmacy"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
