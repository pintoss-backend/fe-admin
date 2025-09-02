import React, { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Card, Table, Tag, Typography, Grid } from 'antd';
import type { Faq } from '@/entities/faq/model';
import { fmtDateTime } from '@/shared/lib/date';
import { DeleteFaqButton } from '@/features/faq/delete/ui/DeleteFaqButton';

const cmpStrKo = (a: string, b: string) => a.localeCompare(b, 'ko-KR');
const cmpNum = (a?: number, b?: number) => (a ?? Infinity) - (b ?? Infinity);
const cmpDateIso = (aIso: string, bIso: string) =>
	new Date(aIso).getTime() - new Date(bIso).getTime();

export const FaqTable: React.FC<{
	items: Faq[];
	loading?: boolean;
	categories?: string[];
	onDelete: (id: string) => void;
	onBulkDelete?: (ids: string[]) => void;
}> = ({ items, loading, categories = [], onDelete, onBulkDelete }) => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const screens = Grid.useBreakpoint();
	const isMobile = !screens.md;

	const columns: ColumnsType<Faq> = useMemo(
		() => [
			{
				title: '카테고리',
				dataIndex: 'category',
				filters: categories.map((c) => ({ text: c, value: c })),
				onFilter: (v, r) => r.category === v,
				sorter: (a, b) => cmpStrKo(a.category, b.category),
				width: 160,
			},
			{
				title: '질문',
				dataIndex: 'question',
				sorter: (a, b) => cmpStrKo(a.question, b.question),
				render: (q: string) => <Typography.Text>{q}</Typography.Text>,
				ellipsis: true,
			},
			{
				title: '공개',
				dataIndex: 'isPublished',
				filters: [
					{ text: '공개', value: true },
					{ text: '비공개', value: false },
				],
				onFilter: (v, r) => r.isPublished === v,
				render: (p: boolean) => (p ? <Tag color="success">공개</Tag> : <Tag>비공개</Tag>),
				width: 110,
			},
			{
				title: '우선순위',
				dataIndex: 'order',
				sorter: (a, b) => cmpNum(a.order, b.order),
				render: (n?: number) => (typeof n === 'number' ? n : '—'),
				width: 120,
				align: 'right' as const,
			},
			{
				title: '업데이트',
				dataIndex: 'updatedAt',
				sorter: (a, b) => cmpDateIso(a.updatedAt, b.updatedAt),
				render: (iso: string) => fmtDateTime(iso),
				width: 180,
			},
			{
				title: '삭제',
				dataIndex: 'delete',
				width: 100,
				fixed: isMobile ? undefined : 'right',
				render: (_: unknown, r) => (
					<DeleteFaqButton onConfirm={() => onDelete(r.id)} size="small" />
				),
			},
		],
		[categories, isMobile, onDelete],
	);

	const rowSelection = {
		selectedRowKeys,
		onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
	};

	return (
		<Card title="전체 FAQ">
			<Table<Faq>
				rowKey={(r) => r.id}
				loading={loading}
				columns={columns}
				dataSource={items}
				rowSelection={onBulkDelete ? rowSelection : undefined}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: [10, 20, 50],
					showTotal: (total) => `총 ${total.toLocaleString()}건`,
				}}
				scroll={isMobile ? undefined : { x: 900 }}
			/>
		</Card>
	);
};
