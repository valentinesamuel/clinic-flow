import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function ConsultationReportPage() {
  const metadata = reportMetadata.consultation;

  return (
    <ReportEmbedPage
      dashboardType="consultation"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
