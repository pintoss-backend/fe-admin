import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
	DashboardOutlined,
	UserOutlined,
	SettingOutlined,
	BellOutlined,
	LogoutOutlined,
	QuestionCircleOutlined,
	MessageOutlined,
	MailOutlined,
	CreditCardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';

const { Sider } = Layout;
const { Text } = Typography;

interface SideMenuProps {
	collapsed: boolean;
	onCollapse: (collapsed: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ collapsed, onCollapse }) => {
	const { logout } = useAuthStore();
	const [selectedKey, setSelectedKey] = useState('dashboard');

	const menuItems = [
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
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		setSelectedKey(key);
		// 여기에 라우팅 로직을 추가할 수 있습니다
		console.log('메뉴 클릭:', key);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<Sider
			collapsible
			collapsed={collapsed}
			onCollapse={onCollapse}
			theme="light"
			width={180}
			collapsedWidth={80}
			style={{
				boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
			}}
		>
			<div
				style={{
					height: 64,
					display: 'flex',
					alignItems: 'center',
					justifyContent: collapsed ? 'center' : 'flex-start',
					padding: collapsed ? '0' : '0 16px',
					borderBottom: '1px solid #f0f0f0',
				}}
			>
				{!collapsed && (
					<Text strong style={{ fontSize: 16, color: '#1890ff' }}>
						메뉴 (아이콘 대체)
					</Text>
				)}
			</div>
			<Menu
				mode="inline"
				selectedKeys={[selectedKey]}
				items={menuItems}
				onClick={handleMenuClick}
				style={{
					borderRight: 0,
					height: 'calc(100vh - 64px)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					padding: '16px',
					borderTop: '1px solid #f0f0f0',
					background: '#fff',
				}}
			>
				<Menu
					mode="inline"
					items={[
						{
							key: 'logout',
							icon: <LogoutOutlined />,
							label: collapsed ? '' : '로그아웃',
							onClick: handleLogout,
						},
					]}
					style={{
						borderRight: 0,
					}}
				/>
			</div>
		</Sider>
	);
};
