import { AppLayout } from '@/shared/ui';
import { UserStats } from '@/widgets/UserStats';

export const Users: React.FC = () => {
	return (
		<AppLayout title="관리자 회원관리" mobileTitle="회원관리">
			<UserStats total={100} blocked={2} withdrawn={3} />
		</AppLayout>
	);
};
