import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function RadiologyReportPage() {
  const metadata = reportMetadata.radiology;

  return (
    <ReportEmbedPage
      dashboardType="radiology"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
