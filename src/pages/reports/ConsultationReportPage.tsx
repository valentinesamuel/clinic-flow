import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function ConsultationReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.consultation ?? { title: 'Consultation Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="consultation"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
