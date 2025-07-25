import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { MobileLayout } from '@/components/mobile/MobileLayout';

export default function Performance() {
  return (
    <MobileLayout
      title="Performance Dashboard"
      currentPage="performance"
      onNavigate={() => {}}
    >
      <div className="p-4">
        <PerformanceDashboard />
      </div>
    </MobileLayout>
  );
}