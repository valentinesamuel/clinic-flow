import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function NursingReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.nursing ?? { title: 'Nursing Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="nursing"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
