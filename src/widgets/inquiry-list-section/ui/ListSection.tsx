import { useInquiryList } from '@/features/inquiries/model/inquiryStore';
import { Table, Tag, Spin } from 'antd';

const ListSection: React.FC = () => {
	const { inquiryList, loading } = useInquiryList();
	const columns = [
		{
			title: '제목',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: '내용',
			dataIndex: 'content',
			key: 'content',
		},
		{
			title: '상태',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'open' ? 'green' : 'volcano'}>
					{status === 'open' ? '진행중' : '완료'}
				</Tag>
			),
		},
		{
			title: '등록일',
			dataIndex: 'createdAt',
			key: 'createdAt',
		},
	];

	return (
		<section>
			{loading ? (
				<div style={{ textAlign: 'center', padding: '2rem' }}>
					<Spin tip="로딩 중..." size="large" />
				</div>
			) : (
				<Table
					dataSource={inquiryList}
					columns={columns}
					rowKey="id"
					pagination={{ pageSize: 10 }}
				/>
			)}
		</section>
	);
};

export default ListSection;
