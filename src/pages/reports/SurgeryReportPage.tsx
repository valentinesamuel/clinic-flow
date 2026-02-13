import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function SurgeryReportPage() {
  const metadata = reportMetadata.surgery;

  return (
    <ReportEmbedPage
      dashboardType="surgery"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
