import { Layout, Typography, Button, Card, Row, Col, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../entities/auth/store/authStore';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					background: '#fff',
					padding: '0 24px',
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Title level={3} style={{ margin: 0 }}>
					관리자 대시보드
				</Title>
				<Space>
					<Text>
						<UserOutlined /> {user?.name} ({user?.email})
					</Text>
					<Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
						로그아웃
					</Button>
				</Space>
			</Header>

			<Content style={{ padding: '24px' }}>
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

				<Card title="최근 활동" style={{ marginTop: 24 }}>
					<Text type="secondary">
						로그인에 성공했습니다! 이제 관리자 대시보드를 사용할 수 있습니다.
					</Text>
				</Card>
			</Content>
		</Layout>
	);
};
