import { style } from '@vanilla-extract/css';

export const LayoutContainer = style({
	minHeight: '100vh',
});

export const DrawerContent = style({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
});

export const DrawerMenu = style({
	borderRight: 0,
	flex: 1,
});

export const DrawerFooter = style({
	padding: '16px',
	borderTop: '1px solid #f0f0f0',
	background: '#fff',
});

export const LogoutButton = style({
	width: '100%',
	textAlign: 'left',
});

export const Header = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	background: '#fff',
	boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
	position: 'sticky',
	top: 0,
	zIndex: 1,
	height: '64px',
	padding: '0 24px',
});

export const MobileHeader = style({
	height: '56px',
	padding: '0 12px',
});

export const HeaderLeft = style({
	display: 'flex',
	alignItems: 'center',
	gap: '12px',
});

export const MobileMenuButton = style({
	padding: '4px 8px',
});

export const HeaderTitle = style({
	margin: 0,
	fontSize: '20px',
});

export const MobileHeaderTitle = style({
	margin: 0,
	fontSize: '16px',
});

export const HeaderRight = style({
	display: 'flex',
	alignItems: 'center',
	gap: '16px',
});

export const MobileHeaderRight = style({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
});

export const UserInfo = style({
	fontSize: '14px',
});

export const MobileUserInfo = style({
	fontSize: '12px',
});

export const Content = style({
	padding: '16px',
	background: '#f5f5f5',
	minHeight: 'calc(100vh - 64px)',
});

export const MobileContent = style({
	padding: '8px',
	background: '#f5f5f5',
	minHeight: 'calc(100vh - 64px)',
});
