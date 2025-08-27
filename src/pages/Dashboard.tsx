import { AppLayout } from '@/shared/ui';
import { DashboardStats, ActivityFeed } from '@/widgets';

export const Dashboard: React.FC = () => {
	return (
		<AppLayout title="관리자 대시보드" mobileTitle="대시보드">
			<DashboardStats />
			<ActivityFeed />
		</AppLayout>
	);
};
