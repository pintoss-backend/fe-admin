import { Tag } from 'antd';
import type { Member } from '@/entities/member/model';

export const getStatusTag = (m: Member) => {
	if (m.isWithdrawn) return <Tag color="default">탈퇴</Tag>;
	if (m.isBlocked) return <Tag color="error">차단</Tag>;
	return <Tag color="success">정상</Tag>;
};
