import { AppLayout } from '@/shared/ui/Layout/Layout';
import { DashboardStats } from '@/widgets/DashboardStats/DashboardStats';
import { ActivityFeed } from '@/widgets/ActivityFeed/ActivityFeed';

export const Dashboard: React.FC = () => {
	return (
		<AppLayout title="관리자 대시보드" mobileTitle="대시보드">
			<DashboardStats />
			<ActivityFeed />
		</AppLayout>
	);
};
