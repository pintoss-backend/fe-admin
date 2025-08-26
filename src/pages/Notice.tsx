import { useState } from 'react';
import { Space, Divider } from 'antd';
import { AppLayout } from '@/shared/ui';
import { NoticeList } from '@/features/notice';
import { NoticeForm } from '@/features/notice';
import type { CreateNoticeData } from '@/entities/notice';

export const Notice = () => {
	const [showForm, setShowForm] = useState(false);

	const handleFormSubmit = (data: CreateNoticeData) => {
		console.log('공지사항 등록 완료:', data);
		setShowForm(false);
		// 여기에 실제 등록 로직을 추가할 수 있습니다
	};

	const handleFormCancel = () => {
		setShowForm(false);
	};

	const handleAddNotice = () => {
		setShowForm(true);
	};

	return (
		<AppLayout title="공지사항 관리" mobileTitle="공지사항">
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				{showForm && (
					<>
						<NoticeForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
						<Divider />
					</>
				)}

				<NoticeList onAddNotice={handleAddNotice} />
			</Space>
		</AppLayout>
	);
};
