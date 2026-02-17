import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function LaboratoryReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.laboratory ?? { title: 'Laboratory Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="laboratory"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
