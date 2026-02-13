import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function LaboratoryReportPage() {
  const metadata = reportMetadata.laboratory;

  return (
    <ReportEmbedPage
      dashboardType="laboratory"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
