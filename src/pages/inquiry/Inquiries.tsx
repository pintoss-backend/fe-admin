import { useState } from 'react';
import { AppLayout } from '@/shared';
import { Card } from 'antd';
import { SearchSection } from '@/widgets/inquiry-search-pannel';
import { ListSection } from '@/widgets/inquiry-list-section';

export const Inquiries = () => {
	const [keyword, setKeyword] = useState('');

	return (
		<AppLayout title="문의내역" mobileTitle="문의내역">
			<Card title="문의내역 목록">
				<SearchSection keyword={keyword} onSearch={setKeyword} />
				<ListSection />
			</Card>
		</AppLayout>
	);
};
