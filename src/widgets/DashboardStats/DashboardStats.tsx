import { Typography, Card, Row, Col } from 'antd';

const { Title, Text } = Typography;

export const DashboardStats: React.FC = () => {
	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={12} lg={8}>
				<Card title="사용자 통계" hoverable>
					<Title level={2}>1,234</Title>
					<Text type="secondary">총 사용자 수</Text>
				</Card>
			</Col>
			<Col xs={24} sm={12} lg={8}>
				<Card title="오늘 방문자" hoverable>
					<Title level={2}>567</Title>
					<Text type="secondary">오늘 방문자 수</Text>
				</Card>
			</Col>
			<Col xs={24} sm={12} lg={8}>
				<Card title="신규 가입자" hoverable>
					<Title level={2}>89</Title>
					<Text type="secondary">이번 주 신규 가입자</Text>
				</Card>
			</Col>
		</Row>
	);
};
