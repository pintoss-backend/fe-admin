import { style } from '@vanilla-extract/css';

export const LoginFormContainer = style({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '100vh',
	width: '100vw',
	background: '#f0f2f5',
});

export const LoginFormCard = style({
	width: 400,
	boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const LoginFormTitle = style({
	textAlign: 'center',
	marginBottom: 32,
});

export const LoginFormFooter = style({
	textAlign: 'center',
	marginTop: 16,
});
