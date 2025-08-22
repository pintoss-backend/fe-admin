import { Layout, Typography, Space, Button, Drawer, Menu } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { defaultMenuItems } from '@/shared/model/menuItems';
import { SideMenu } from '@/shared/ui/SideMenu';
import { UserProfile } from '@/widgets';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './Layout.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface LayoutProps {
	children: ReactNode;
	title: string;
	mobileTitle?: string;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, title, mobileTitle }) => {
	const { user, logout } = useAuthStore();
	const { collapsed, setCollapsed } = useLayoutStore();
	const [isMobile, setIsMobile] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigate = useNavigate();

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
	}, [setCollapsed]);

	// 페이지 title 설정
	useEffect(() => {
		document.title = `${title} - Admin`;
	}, [title]);

	return (
		<Layout className={styles.LayoutContainer}>
			{!isMobile && <SideMenu collapsed={collapsed} onCollapse={setCollapsed} />}
			{isMobile && (
				<Drawer
					title="메뉴"
					placement="left"
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					width={250}
					styles={{ body: { padding: 0 } }}
				>
					<div className={styles.DrawerContent}>
						<Menu
							mode="inline"
							items={defaultMenuItems}
							className={styles.DrawerMenu}
							onClick={({ key }: { key: string }) => {
								navigate(`/${key}`);
								setMobileMenuOpen(false);
							}}
						/>
						<div className={styles.DrawerFooter}>
							<Button
								type="text"
								icon={<LogoutOutlined />}
								onClick={() => {
									handleLogout();
									setMobileMenuOpen(false);
								}}
								className={styles.LogoutButton}
							>
								로그아웃
							</Button>
						</div>
					</div>
				</Drawer>
			)}
			<Layout>
				<Header className={isMobile ? styles.MobileHeader : styles.Header}>
					<div className={styles.HeaderLeft}>
						{isMobile && (
							<Button
								type="text"
								icon={<MenuOutlined />}
								onClick={toggleMobileMenu}
								className={styles.MobileMenuButton}
							/>
						)}
						<Title
							level={isMobile ? 4 : 3}
							className={isMobile ? styles.MobileHeaderTitle : styles.HeaderTitle}
						>
							{isMobile ? mobileTitle || title : title}
						</Title>
					</div>
					<Space
						size={isMobile ? 'small' : 'middle'}
						className={isMobile ? styles.MobileHeaderRight : styles.HeaderRight}
					>
						{!isMobile && <UserProfile />}
						<Button
							type="primary"
							icon={<LogoutOutlined />}
							onClick={handleLogout}
							size={isMobile ? 'small' : 'middle'}
						>
							{!isMobile && '로그아웃'}
						</Button>
					</Space>
				</Header>

				<Content className={isMobile ? styles.MobileContent : styles.Content}>{children}</Content>
			</Layout>
		</Layout>
	);
};
