import { style } from '@vanilla-extract/css';

export const SideMenuContainer = style({
	boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
});

export const SideMenuHeader = style({
	height: 64,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	padding: '0 16px',
	borderBottom: '1px solid #f0f0f0',
});

export const SideMenuHeaderCollapsed = style({
	justifyContent: 'center',
	padding: 0,
});

export const SideMenuTitle = style({
	fontSize: 16,
	color: '#1890ff',
	fontWeight: 'bold',
});

export const SideMenuContent = style({
	borderRight: 0,
	height: 'calc(100vh - 64px)',
});

export const SideMenuFooter = style({
	position: 'absolute',
	bottom: 0,
	width: '100%',
	padding: '16px',
	borderTop: '1px solid #f0f0f0',
	background: '#fff',
});

export const SideMenuFooterMenu = style({
	borderRight: 0,
});
