import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/shared/ui';
import { Alert, Space } from 'antd';
import type { Member } from '@/entities/member';
import { getMembers } from '@/entities/member';
import { UserStats } from '@/widgets/UserStats';
import { MembersFilters, useMembersFilters } from '@/widgets/UserFilter';
import { MembersTable } from '@/widgets/UserTable';

export const Users: React.FC = () => {
	const [list, setList] = useState<Member[]>([]);
	const [loading, setLoading] = useState(false);
	const { q, status } = useMembersFilters();

	useEffect(() => {
		setLoading(true);
		getMembers()
			.then((rows) => setList(rows))
			.finally(() => setLoading(false));
	}, []);

	const filtered: Member[] = useMemo(() => {
		let rows = list;
		if (status === 'ACTIVE') rows = rows.filter((m) => !m.isWithdrawn && !m.isBlocked);
		if (status === 'BLOCKED') rows = rows.filter((m) => m.isBlocked && !m.isWithdrawn);
		if (status === 'WITHDRAWN') rows = rows.filter((m) => m.isWithdrawn);

		const Q = q.trim();
		if (!Q) return rows;
		const lower = Q.toLowerCase();
		const onlyNum = (s: string) => s.replace(/[^0-9]/g, '');
		return rows.filter(
			(m) => m.name.toLowerCase().includes(lower) || onlyNum(m.phone).includes(onlyNum(Q)),
		);
	}, [list, q, status]);

	const counts = useMemo(() => {
		const total = list.length;
		const blocked = list.filter((m) => m.isBlocked && !m.isWithdrawn).length;
		const withdrawn = list.filter((m) => m.isWithdrawn).length;
		return { total, blocked, withdrawn };
	}, [list]);

	const handleToggleBlock = (memberId: string, next: boolean) => {
		setList((prev) => prev.map((m) => (m.id === memberId ? { ...m, isBlocked: next } : m)));
	};

	return (
		<AppLayout title="회원 관리" mobileTitle="회원">
			<Space direction="vertical" size={16} style={{ width: '100%' }}>
				<UserStats total={counts.total} blocked={counts.blocked} withdrawn={counts.withdrawn} />
				<MembersFilters />
				<Alert
					type="warning"
					showIcon
					message="회원자료 삭제 시 다른 회원이 기존 회원아이디를 사용하지 못하도록 회원아이디, 이름, 닉네임은 삭제하지 않고 영구 보관합니다."
				/>
				<MembersTable loading={loading} data={filtered} onToggleBlock={handleToggleBlock} />
			</Space>
		</AppLayout>
	);
};
