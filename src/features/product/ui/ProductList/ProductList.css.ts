import { style } from '@vanilla-extract/css';

export const productListCard = style({
	width: '100%',
});

export const categoryTag = style({
	margin: 0,
	fontWeight: 500,
});

export const parentRow = style({
	backgroundColor: '#ffffff',
	fontWeight: 600,
	':hover': {
		backgroundColor: '#f5f5f5',
	},
});

export const childRow = style({
	backgroundColor: '#ffffff',
	':hover': {
		backgroundColor: '#f5f5f5',
	},
});

export const expandIconContainer = style({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	width: '100%',
});

export const expandedContent = style({
	// 애니메이션은 전역 CSS에서 처리
});

export const expandButton = style({
	cursor: 'pointer',
	color: '#1890ff',
	transition: 'transform 0.3s ease-in-out',
});

export const imageContainer = style({
	width: 32,
	height: 32,
	borderRadius: '4px',
	backgroundColor: '#f5f5f5',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: '1px solid #d9d9d9',
});

export const priceText = style({
	fontWeight: 'bold',
	color: '#1890ff',
});

export const popconfirmButton = style({
	background: '#ff4d4f',
	borderColor: '#ff4d4f',
	fontWeight: 500,
});

export const cancelButton = style({
	borderColor: '#d9d9d9',
	color: '#666',
	fontWeight: 500,
});

export const issuerInfoContainer = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
});

export const productInfoContainer = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	paddingLeft: 20,
});

export const discountRateContainer = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '2px',
});

export const discountRateText = style({
	fontSize: '12px',
	color: '#ff4d4f',
});

export const discountRateTextChild = style({
	fontSize: '12px',
	color: '#666',
});

export const productDescriptionText = style({
	fontSize: '12px',
	color: '#666',
});

export const contactContainer = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
});
