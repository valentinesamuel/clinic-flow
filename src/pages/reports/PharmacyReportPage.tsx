import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function PharmacyReportPage() {
  const metadata = reportMetadata.pharmacy;

  return (
    <ReportEmbedPage
      dashboardType="pharmacy"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
