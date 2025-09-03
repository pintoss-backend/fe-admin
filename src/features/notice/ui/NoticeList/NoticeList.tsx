import { Typography, Card, List, Tag, Button, Space, Popconfirm, message, Empty } from 'antd';
import {
	DeleteOutlined,
	PlusOutlined,
	EditOutlined,
	MenuOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNoticeStore } from '@/entities/notice/store/noticeStore';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// 드래그 가능한 공지사항 아이템 컴포넌트
const SortableNoticeItem = ({ notice, onEditNotice, onDelete }: any) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: notice.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<List.Item className={styles.noticeItem}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
					{/* 드래그 핸들만 드래그 이벤트 적용 */}
					<div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
						<MenuOutlined style={{ color: '#999', fontSize: '16px', marginLeft: '-8px' }} />
					</div>
					<List.Item.Meta
						style={{ marginLeft: '16px' }}
						title={
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								{notice.title}
								<Tag color={getPriorityColor(notice.priority)} className={styles.priorityTag}>
									{getPriorityText(notice.priority)}
								</Tag>
							</div>
						}
						description={
							<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
								<Text type="secondary">{notice.content}</Text>
								<Text type="secondary" className={styles.dateText}>
									{notice.date}
								</Text>
							</div>
						}
					/>
				</div>
				<Space>
					{onEditNotice && (
						<Button
							type="text"
							icon={<EditOutlined />}
							size="small"
							onClick={() => onEditNotice(notice)}
						/>
					)}
					<Popconfirm
						title={
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
								<span style={{ fontWeight: 600 }}>공지사항 삭제</span>
							</div>
						}
						description={
							<div style={{ marginLeft: '24px', color: '#666' }}>공지사항을 삭제하시겠습니까?</div>
						}
						onConfirm={() => onDelete(notice.id)}
						okText="삭제"
						cancelText="취소"
						okButtonProps={{
							danger: true,
							style: {
								background: '#ff4d4f',
								borderColor: '#ff4d4f',
								fontWeight: 500,
							},
						}}
						cancelButtonProps={{
							style: {
								borderColor: '#d9d9d9',
								color: '#666',
								fontWeight: 500,
							},
						}}
						placement="topRight"
						overlayStyle={{
							borderRadius: '8px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
						}}
						icon={null}
					>
						<Button type="text" icon={<DeleteOutlined />} danger size="small" />
					</Popconfirm>
				</Space>
			</List.Item>
		</div>
	);
};

interface NoticeListProps {
	onAddNotice?: () => void;
	onEditNotice?: (notice: any) => void;
}

export const NoticeList: React.FC<NoticeListProps> = ({ onAddNotice, onEditNotice }) => {
	const { notices, removeNotice, updateNoticeOrder } = useNoticeStore();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDelete = (id: string) => {
		try {
			removeNotice(id);
			message.success('공지사항이 성공적으로 삭제되었습니다.');
		} catch (error) {
			console.error('공지사항 삭제 실패:', error);
			message.error('공지사항 삭제에 실패했습니다.');
		}
	};

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = notices.findIndex((notice) => notice.id === active.id);
			const newIndex = notices.findIndex((notice) => notice.id === over.id);

			const newNotices = arrayMove(notices, oldIndex, newIndex);
			updateNoticeOrder(newNotices);
		}
	};

	const extraButton = onAddNotice ? (
		<Button type="primary" icon={<PlusOutlined />} onClick={onAddNotice}>
			공지사항 등록
		</Button>
	) : null;

	return (
		<div className={styles.noticeListCard}>
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						공지사항 목록
						<Tag color="default" style={{ margin: 0 }}>
							총 {notices.length}건
						</Tag>
					</div>
				}
				extra={extraButton}
			>
				{notices.length === 0 ? (
					<Empty
						description="등록된 공지사항이 없습니다."
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ padding: '40px 0' }}
					/>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={notices.map((notice) => notice.id)}
							strategy={verticalListSortingStrategy}
						>
							<List
								dataSource={notices}
								renderItem={(notice) => (
									<SortableNoticeItem
										notice={notice}
										onEditNotice={onEditNotice}
										onDelete={handleDelete}
									/>
								)}
							/>
						</SortableContext>
					</DndContext>
				)}
			</Card>
		</div>
	);
};
