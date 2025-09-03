import { useState } from 'react';
import { Space, Divider } from 'antd';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { NoticeList } from '@/features/notice/ui/NoticeList';
import { NoticeForm } from '@/features/notice/ui/NoticeForm';
import type { CreateNoticeData, Notice as NoticeItem } from '@/entities/notice/model/notice';

export const Notice = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);

	const handleFormSubmit = (data: CreateNoticeData) => {
		if (editingNotice) {
			console.log('공지사항 수정 완료:', { id: editingNotice.id, ...data });
			// 여기에 실제 수정 로직을 추가할 수 있습니다
		} else {
			console.log('공지사항 등록 완료:', data);
			// 여기에 실제 등록 로직을 추가할 수 있습니다
		}
		setShowForm(false);
		setEditingNotice(null);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingNotice(null);
	};

	const handleAddNotice = () => {
		setEditingNotice(null);
		setShowForm(true);
	};

	const handleEditNotice = (notice: NoticeItem) => {
		setEditingNotice(notice);
		setShowForm(true);
	};

	return (
		<AppLayout title="공지사항 관리" mobileTitle="공지사항">
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				{showForm && (
					<>
						<NoticeForm
							onSubmit={handleFormSubmit}
							onCancel={handleFormCancel}
							initialData={editingNotice}
						/>
						<Divider />
					</>
				)}

				<NoticeList onAddNotice={handleAddNotice} onEditNotice={handleEditNotice} />
			</Space>
		</AppLayout>
	);
};
