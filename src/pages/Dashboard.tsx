import { Layout, Typography, Card, Row, Col, Space, Button, Drawer, Menu } from 'antd';
import {
	UserOutlined,
	LogoutOutlined,
	MenuOutlined,
	DashboardOutlined,
	BellOutlined,
	SettingOutlined,
	QuestionCircleOutlined,
	MessageOutlined,
	MailOutlined,
	CreditCardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';
import { SideMenu } from '@/shared/ui';
import { useState, useEffect } from 'react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
	const { user, logout } = useAuthStore();
	const [collapsed, setCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	// 모바일 감지
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
			if (window.innerWidth <= 768) {
				setCollapsed(true);
			}
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{!isMobile && <SideMenu collapsed={collapsed} onCollapse={setCollapsed} />}
			{isMobile && (
				<Drawer
					title="메뉴"
					placement="left"
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					width={250}
					bodyStyle={{ padding: 0 }}
				>
					<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						<Menu
							mode="inline"
							items={[
								{
									key: 'dashboard',
									icon: <DashboardOutlined />,
									label: '대시보드',
								},
								{
									key: 'users',
									icon: <UserOutlined />,
									label: '회원 관리',
								},
								{
									key: 'payments',
									icon: <CreditCardOutlined />,
									label: '결제 내역',
								},
								{
									key: 'sms',
									icon: <MailOutlined />,
									label: 'SMS 관리',
								},
								{
									key: 'notifications',
									icon: <BellOutlined />,
									label: '공지사항',
								},
								{
									key: 'faq',
									icon: <QuestionCircleOutlined />,
									label: '자주 묻는 질문',
								},
								{
									key: 'inquiries',
									icon: <MessageOutlined />,
									label: '문의내역',
								},
								{
									key: 'settings',
									icon: <SettingOutlined />,
									label: '설정',
								},
							]}
							style={{
								borderRight: 0,
								flex: 1,
							}}
							onClick={({ key }: { key: string }) => {
								console.log('메뉴 클릭:', key);
								setMobileMenuOpen(false);
							}}
						/>
						<div
							style={{
								padding: '16px',
								borderTop: '1px solid #f0f0f0',
								background: '#fff',
							}}
						>
							<Button
								type="text"
								icon={<LogoutOutlined />}
								onClick={() => {
									handleLogout();
									setMobileMenuOpen(false);
								}}
								style={{ width: '100%', textAlign: 'left' }}
							>
								로그아웃
							</Button>
						</div>
					</div>
				</Drawer>
			)}
			<Layout>
				<Header
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						background: '#fff',
						padding: isMobile ? '0 12px' : '0 24px',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
						position: 'sticky',
						top: 0,
						zIndex: 1,
						height: isMobile ? '56px' : '64px',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						{isMobile && (
							<Button
								type="text"
								icon={<MenuOutlined />}
								onClick={toggleMobileMenu}
								style={{ padding: '4px 8px' }}
							/>
						)}
						<Title
							level={isMobile ? 4 : 3}
							style={{ margin: 0, fontSize: isMobile ? '16px' : '20px' }}
						>
							{isMobile ? '대시보드' : '관리자 대시보드'}
						</Title>
					</div>
					<Space size={isMobile ? 'small' : 'middle'}>
						{!isMobile && (
							<Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
								<UserOutlined /> {user?.name} ({user?.email})
							</Text>
						)}
						<Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} size="small">
							{!isMobile && '로그아웃'}
						</Button>
					</Space>
				</Header>

				<Content
					style={{
						padding: isMobile ? '8px' : '16px',
						background: '#f5f5f5',
						minHeight: 'calc(100vh - 64px)',
					}}
				>
					<Row gutter={isMobile ? [8, 8] : [16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Card title="사용자 통계" hoverable size={isMobile ? 'small' : 'default'}>
								<Title level={isMobile ? 3 : 2}>1,234</Title>
								<Text type="secondary">총 사용자 수</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Card title="오늘 방문자" hoverable size={isMobile ? 'small' : 'default'}>
								<Title level={isMobile ? 3 : 2}>567</Title>
								<Text type="secondary">오늘 방문자 수</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Card title="신규 가입자" hoverable size={isMobile ? 'small' : 'default'}>
								<Title level={isMobile ? 3 : 2}>89</Title>
								<Text type="secondary">이번 주 신규 가입자</Text>
							</Card>
						</Col>
					</Row>

					<Card
						title="최근 활동"
						style={{ marginTop: isMobile ? 12 : 24 }}
						size={isMobile ? 'small' : 'default'}
					>
						<Text type="secondary">
							로그인에 성공했습니다! 이제 관리자 대시보드를 사용할 수 있습니다.
						</Text>
					</Card>
				</Content>
			</Layout>
		</Layout>
	);
};
