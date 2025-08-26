import { Form, Input, Select, Button, DatePicker, Space, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useNoticeStore } from '@/entities/notice';
import type { CreateNoticeData } from '@/entities/notice';
import * as styles from './NoticeForm.css';

const { TextArea } = Input;
const { Option } = Select;

interface NoticeFormProps {
	onSubmit?: (data: CreateNoticeData) => void;
	onCancel?: () => void;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit, onCancel }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { addNotice } = useNoticeStore();

	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			const noticeData: CreateNoticeData = {
				title: values.title,
				content: values.content,
				priority: values.priority,
				date: values.date.format('YYYY-MM-DD'),
			};

			addNotice(noticeData);
			message.success('공지사항이 성공적으로 등록되었습니다.');
			onSubmit?.(noticeData);
			form.resetFields();
		} catch (error) {
			console.error('공지사항 등록 실패:', error);
			message.error('공지사항 등록에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel?.();
	};

	return (
		<Card title="공지사항 등록" className={styles.noticeFormCard}>
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
						<Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
							등록
						</Button>
						<Button onClick={handleCancel}>취소</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};
