// pages/admin/faq-new/ui/Page.tsx
import React, { useEffect, useMemo } from 'react';
import { AppLayout } from '@/shared/ui';
import { Space, message } from 'antd';
import { FaqEditor } from '@/widgets/FaqEditor';
import { FaqTable } from '@/widgets/FaqTable';
import { useFaqStore } from '@/entities/faq/store';

export const NewFaq: React.FC = () => {
	const { items, loading, submitting, fetchList, createOne, removeOne } = useFaqStore();

	useEffect(() => {
		fetchList();
	}, [fetchList]);

	const categories = useMemo(() => Array.from(new Set(items.map((f) => f.category))), [items]);

	return (
		<AppLayout title="FAQ 등록" mobileTitle="FAQ 등록">
			<Space direction="vertical" size={16} style={{ width: '100%' }}>
				<FaqEditor
					categories={categories}
					submitting={submitting}
					onSubmit={async (values) => {
						try {
							await createOne(values);
							message.success('FAQ가 등록되었습니다.');
						} catch {
							message.error('등록에 실패했습니다.');
						}
					}}
				/>
				<FaqTable
					items={items}
					loading={loading}
					categories={categories}
					onDelete={async (id) => {
						try {
							await removeOne(id);
							message.success('삭제되었습니다.');
						} catch {
							message.error('삭제에 실패했습니다.');
						}
					}}
				/>
			</Space>
		</AppLayout>
	);
};
