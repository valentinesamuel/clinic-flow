import ReportEmbedPage from './ReportEmbedPage';
import { reportMetadata } from '@/data/reports';

export default function ClaimsReportPage() {
  const metadata = reportMetadata.claims;

  return (
    <ReportEmbedPage
      dashboardType="claims"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
