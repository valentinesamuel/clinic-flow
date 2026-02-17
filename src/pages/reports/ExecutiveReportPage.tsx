import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function ExecutiveReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.executive ?? { title: 'Executive Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="executive"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
