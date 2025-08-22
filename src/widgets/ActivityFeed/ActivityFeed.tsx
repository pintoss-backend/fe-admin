import { Typography, Card } from 'antd';

const { Text } = Typography;

export const ActivityFeed: React.FC = () => {
	return (
		<Card title="최근 활동" style={{ marginTop: 24 }}>
			<Text type="secondary">
				로그인에 성공했습니다! 이제 관리자 대시보드를 사용할 수 있습니다.
			</Text>
		</Card>
	);
};
