import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';
import { DashboardMetadata } from '@/types/report.types';

export default function RadiologyReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata: DashboardMetadata = allMetadata?.radiology ?? { title: 'Radiology Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="radiology"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
