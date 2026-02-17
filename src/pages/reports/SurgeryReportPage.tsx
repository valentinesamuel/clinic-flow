import ReportEmbedPage from './ReportEmbedPage';
import { useReportMetadata } from '@/hooks/queries/useReportQueries';

export default function SurgeryReportPage() {
  const { data: allMetadata } = useReportMetadata();
  const metadata = (allMetadata as any)?.surgery ?? { title: 'Surgery Report', description: '', metrics: [] };

  return (
    <ReportEmbedPage
      dashboardType="surgery"
      title={metadata.title}
      description={metadata.description}
      metrics={metadata.metrics}
    />
  );
}
