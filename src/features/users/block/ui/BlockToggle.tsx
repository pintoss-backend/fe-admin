import React from 'react';
import { Checkbox } from 'antd';
import type { Member } from '@/entities/member/model/index';

export const BlockToggle: React.FC<{
	member: Member;
	onToggle: (next: boolean) => void;
}> = ({ member, onToggle }) => (
	<Checkbox
		disabled={member.isWithdrawn}
		checked={member.isBlocked}
		onChange={(e) => onToggle(e.target.checked)}
	>
		{member.isBlocked ? '해제' : '차단'}
	</Checkbox>
);
