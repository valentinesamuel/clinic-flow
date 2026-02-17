import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function RadiologyReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.radiology ?? { title: 'Radiology Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="radiology"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
