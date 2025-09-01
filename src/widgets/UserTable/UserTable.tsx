import React, { useMemo, useCallback } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Table, Typography } from 'antd';
import type { Member } from '@/entities/member/model';
import { StatusTag } from '@/entities/member/ui/StatusTag';
import { BlockToggle } from '@/features/users/block/ui/BlockToggle';
import { fmtDateTime } from '@/shared/lib/date';
import { cmpStrKo, cmpDateIso } from '@/shared/lib/sort';

export const MembersTable: React.FC<{
	loading?: boolean;
	data: Member[];
	onToggleBlock: (memberId: string, next: boolean) => void;
}> = ({ loading, data, onToggleBlock }) => {
	const showTotal = useCallback((total: number) => `총 ${total.toLocaleString()}명`, []);

	const columns: ColumnsType<Member> = useMemo(
		() => [
			{
				title: '상태',
				dataIndex: 'status',
				width: 90,
				render: (_: unknown, r) => <StatusTag member={r} />,
			},
			{
				title: '이름',
				dataIndex: 'name',
				sorter: (a, b) => cmpStrKo(a.name, b.name),
				sortDirections: ['ascend', 'descend'],
				render: (name: string, r) => (
					<>
						<Typography.Text strong>{name}</Typography.Text>{' '}
						<Typography.Text type="secondary">#{r.id}</Typography.Text>
					</>
				),
			},
			{
				title: '전화번호',
				dataIndex: 'phone',
				width: 150,
				sortDirections: ['ascend', 'descend'],
			},
			{
				title: '가입일',
				dataIndex: 'joinedAt',
				width: 180,
				sorter: (a, b) => cmpDateIso(a.joinedAt, b.joinedAt),
				sortDirections: ['descend', 'ascend'],
				render: (iso: string) => fmtDateTime(iso),
			},
			{
				title: '최종 접속일',
				dataIndex: 'lastLoginAt',
				width: 180,
				sorter: (a, b) => cmpDateIso(a.lastLoginAt, b.lastLoginAt),
				sortDirections: ['descend', 'ascend'],
				render: (iso: string) => fmtDateTime(iso),
			},
			{
				title: '가입시 IP',
				dataIndex: 'signupIp',
				width: 180,
				render: (ip: string) => <Typography.Text copyable>{ip}</Typography.Text>,
			},
			{
				title: '접속 차단',
				dataIndex: 'isBlocked',
				width: 120,
				render: (_: unknown, r) => (
					<BlockToggle member={r} onToggle={(next) => onToggleBlock(r.id, next)} />
				),
			},
		],
		[onToggleBlock],
	);

	return (
		<Table<Member>
			rowKey={(r) => r.id}
			loading={loading}
			columns={columns}
			dataSource={data}
			pagination={{
				pageSize: 10,
				showSizeChanger: true,
				pageSizeOptions: [10, 20, 50],
				showTotal,
			}}
		/>
	);
};
