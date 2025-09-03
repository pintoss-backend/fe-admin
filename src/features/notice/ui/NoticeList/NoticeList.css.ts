import { style, globalStyle } from '@vanilla-extract/css';

export const noticeListCard = style({
	width: '100%',
});

export const noticeItem = style({
	width: '100%',
});

export const priorityTag = style({
	fontSize: '11px',
	fontWeight: 600,
	textTransform: 'uppercase',
	borderRadius: '4px',
});

export const dateText = style({
	fontSize: '12px',
	color: '#8c8c8c',
});

// 글로벌 스타일로 Ant Design 클래스 스타일링
globalStyle(`${noticeListCard} .ant-card-head-title`, {
	fontWeight: 600,
	fontSize: '16px',
});

globalStyle(`${noticeItem} .ant-list-item`, {
	padding: '16px 0',
	borderBottom: '1px solid #f0f0f0',
});

globalStyle(`${noticeItem} .ant-list-item:last-child`, {
	borderBottom: 'none',
});

globalStyle(`${noticeItem} .ant-list-item-meta-title`, {
	marginBottom: '8px',
	fontWeight: 500,
});

globalStyle(`${noticeItem} .ant-list-item-meta-description .ant-typography`, {
	lineHeight: 1.5,
});
