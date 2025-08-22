import { Typography, Card } from 'antd';
import { AppLayout } from '@/shared/ui';

const { Text } = Typography;

export const Notice = () => {
	return (
		<AppLayout title="공지사항 관리" mobileTitle="공지사항">
			<Card title="공지사항 목록">
				<Text type="secondary">
					공지사항 관리 페이지입니다. 여기에 공지사항 목록과 관리 기능을 추가할 수 있습니다.
				</Text>
			</Card>
		</AppLayout>
	);
};
