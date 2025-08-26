import { Typography, Card, List, Tag, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNoticeStore } from '@/entities/notice';
import * as styles from './NoticeList.css';

const { Text } = Typography;

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
	switch (priority) {
		case 'high':
			return 'red';
		case 'medium':
			return 'orange';
		case 'low':
			return 'green';
		default:
			return 'default';
	}
};

const getPriorityText = (priority: 'high' | 'medium' | 'low') => {
	switch (priority) {
		case 'high':
			return '높음';
		case 'medium':
			return '보통';
		case 'low':
			return '낮음';
		default:
			return priority;
	}
};

interface NoticeListProps {
	onAddNotice?: () => void;
}

export const NoticeList: React.FC<NoticeListProps> = ({ onAddNotice }) => {
	const { notices, removeNotice } = useNoticeStore();

	const handleDelete = (id: string) => {
		removeNotice(id);
	};

	const extraButton = onAddNotice ? (
		<Button type="primary" icon={<PlusOutlined />} onClick={onAddNotice}>
			공지사항 등록
		</Button>
	) : null;

	return (
		<div className={styles.noticeListCard}>
			<Card title="공지사항 목록" extra={extraButton}>
				<List
					dataSource={notices}
					renderItem={(notice) => (
						<List.Item className={styles.noticeItem}>
							<List.Item.Meta
								title={
									<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										{notice.title}
										<Tag color={getPriorityColor(notice.priority)} className={styles.priorityTag}>
											{getPriorityText(notice.priority)}
										</Tag>
									</div>
								}
								description={
									<div>
										<Text type="secondary">{notice.content}</Text>
										<br />
										<Text type="secondary" className={styles.dateText}>
											{notice.date}
										</Text>
									</div>
								}
							/>
							<Space>
								<Popconfirm
									title="공지사항 삭제"
									description="이 공지사항을 삭제하시겠습니까?"
									onConfirm={() => handleDelete(notice.id)}
									okText="삭제"
									cancelText="취소"
								>
									<Button type="text" icon={<DeleteOutlined />} danger size="small" />
								</Popconfirm>
							</Space>
						</List.Item>
					)}
				/>
			</Card>
		</div>
	);
};
