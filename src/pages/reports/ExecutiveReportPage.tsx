import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function ExecutiveReportPage() {
  const metadata = reportMetadata.executive;

  return (
    <ReportEmbedPage
      dashboardType="executive"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
