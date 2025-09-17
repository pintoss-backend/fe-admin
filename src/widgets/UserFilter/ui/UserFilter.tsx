import React from 'react';
import { Button, Input, Space } from 'antd';
import { useMembersFilters } from '../model/store';

export const MembersFilters: React.FC = () => {
	const { q, status, setQ, setStatus } = useMembersFilters();

	return (
		<Space wrap>
			<Button type={status === 'ALL' ? 'primary' : 'default'} onClick={() => setStatus('ALL')}>
				전체
			</Button>
			<Button
				type={status === 'ACTIVE' ? 'primary' : 'default'}
				onClick={() => setStatus('ACTIVE')}
			>
				정상
			</Button>
			<Button
				type={status === 'BLOCKED' ? 'primary' : 'default'}
				onClick={() => setStatus('BLOCKED')}
			>
				차단
			</Button>
			<Button
				type={status === 'WITHDRAWN' ? 'primary' : 'default'}
				onClick={() => setStatus('WITHDRAWN')}
			>
				탈퇴
			</Button>
			<Input.Search
				allowClear
				placeholder="이름 또는 전화번호 검색"
				value={q}
				onChange={(e) => setQ(e.target.value)}
				style={{ width: 280 }}
				onSearch={(v) => setQ(v)}
			/>
		</Space>
	);
};
