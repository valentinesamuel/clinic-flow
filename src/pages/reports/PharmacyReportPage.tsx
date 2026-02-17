import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function PharmacyReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.pharmacy ?? { title: 'Pharmacy Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="pharmacy"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
