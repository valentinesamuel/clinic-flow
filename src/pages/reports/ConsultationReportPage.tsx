import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function ConsultationReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.consultation ?? { title: 'Consultation Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="consultation"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
