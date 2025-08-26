import { Form, Input, Select, Button, DatePicker, Space, Card, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNoticeStore } from '@/entities/notice';
import type { CreateNoticeData, Notice } from '@/entities/notice';
import * as styles from './NoticeForm.css';

const { TextArea } = Input;
const { Option } = Select;

interface NoticeFormProps {
	onSubmit?: (data: CreateNoticeData) => void;
	onCancel?: () => void;
	initialData?: Notice | null;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit, onCancel, initialData }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { addNotice, updateNotice } = useNoticeStore();
	const isEditMode = !!initialData;

	// 수정 모드일 때 폼 초기값 설정
	useEffect(() => {
		if (initialData) {
			form.setFieldsValue({
				title: initialData.title,
				content: initialData.content,
				priority: initialData.priority,
				date: dayjs(initialData.date),
			});
		}
	}, [initialData, form]);

	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			const noticeData: CreateNoticeData = {
				title: values.title,
				content: values.content,
				priority: values.priority,
				date: values.date.format('YYYY-MM-DD'),
			};

			if (isEditMode && initialData) {
				updateNotice(initialData.id, noticeData);
				message.success('공지사항이 성공적으로 수정되었습니다.');
			} else {
				addNotice(noticeData);
				message.success('공지사항이 성공적으로 등록되었습니다.');
			}

			onSubmit?.(noticeData);
			form.resetFields();
		} catch (error) {
			console.error('공지사항 처리 실패:', error);
			message.error(isEditMode ? '공지사항 수정에 실패했습니다.' : '공지사항 등록에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel?.();
	};

	return (
		<Card title={isEditMode ? '공지사항 수정' : '공지사항 등록'} className={styles.noticeFormCard}>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					priority: 'medium',
					date: dayjs(),
				}}
			>
				<Form.Item
					name="title"
					label="제목"
					rules={[{ required: true, message: '제목을 입력해주세요' }]}
				>
					<Input placeholder="공지사항 제목을 입력하세요" />
				</Form.Item>

				<Form.Item
					name="content"
					label="내용"
					rules={[{ required: true, message: '내용을 입력해주세요' }]}
				>
					<TextArea rows={4} placeholder="공지사항 내용을 입력하세요" />
				</Form.Item>

				<Form.Item
					name="priority"
					label="우선순위"
					rules={[{ required: true, message: '우선순위를 선택해주세요' }]}
				>
					<Select placeholder="우선순위를 선택하세요">
						<Option value="high">높음</Option>
						<Option value="medium">보통</Option>
						<Option value="low">낮음</Option>
					</Select>
				</Form.Item>

				<Form.Item
					name="date"
					label="등록일"
					rules={[{ required: true, message: '등록일을 선택해주세요' }]}
				>
					<DatePicker style={{ width: '100%' }} placeholder="등록일을 선택하세요" />
				</Form.Item>

				<Form.Item className={styles.formActions}>
					<Space>
						<Button
							type="primary"
							htmlType="submit"
							icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
							loading={loading}
						>
							{isEditMode ? '수정' : '등록'}
						</Button>
						<Button onClick={handleCancel}>취소</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};
