import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function NursingReportPage() {
  const metadata = reportMetadata.nursing;

  return (
    <ReportEmbedPage
      dashboardType="nursing"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
