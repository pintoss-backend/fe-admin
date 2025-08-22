import { useState, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { defaultMenuItems } from '@/shared/model/menuItems';
import { useNavigate, useLocation } from 'react-router-dom';
import * as styles from './SideMenu.css';

const { Sider } = Layout;
const { Text } = Typography;

interface SideMenuProps {
	collapsed: boolean;
	onCollapse: (collapsed: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ collapsed, onCollapse }) => {
	const { logout } = useAuthStore();
	const { setCollapsed } = useLayoutStore();
	const [selectedKey, setSelectedKey] = useState('dashboard');
	const navigate = useNavigate();
	const location = useLocation();

	// URL 변경 시 selectedKey 업데이트
	useEffect(() => {
		const path = location.pathname;
		const key = path.split('/')[1] || 'dashboard';
		setSelectedKey(key);
	}, [location.pathname]);

	const handleMenuClick = ({ key }: { key: string }) => {
		setSelectedKey(key);
		console.log('메뉴 클릭:', key);
		navigate(`/${key}`);
		// 모바일에서 메뉴 클릭 시 자동으로 접기
		if (window.innerWidth <= 768) {
			setCollapsed(true);
		}
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
			className={styles.SideMenuContainer}
		>
			<div className={collapsed ? styles.SideMenuHeaderCollapsed : styles.SideMenuHeader}>
				{!collapsed && (
					<Text strong className={styles.SideMenuTitle}>
						메뉴 (아이콘 대체)
					</Text>
				)}
			</div>
			<Menu
				mode="inline"
				selectedKeys={[selectedKey]}
				items={defaultMenuItems}
				onClick={handleMenuClick}
				className={styles.SideMenuContent}
			/>
			<div className={styles.SideMenuFooter}>
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
					className={styles.SideMenuFooterMenu}
				/>
			</div>
		</Sider>
	);
};
