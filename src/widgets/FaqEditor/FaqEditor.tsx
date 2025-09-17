import React, { useMemo } from 'react';
import { Form, Input, Switch, Button, Space, Card, InputNumber } from 'antd';
import type { FaqCreateInput } from '@/entities/faq/model';

export const FaqEditor: React.FC<{
	categories?: string[];
	onSubmit: (values: FaqCreateInput) => Promise<void> | void;
	submitting?: boolean;
}> = ({ categories = [], onSubmit, submitting }) => {
	const [form] = Form.useForm<FaqCreateInput & { tagsCsv?: string }>();

	const categoryHint = useMemo(
		() => (categories.length ? `예) ${categories.join(', ')}` : '예) 가입/로그인, 결제, 계정'),
		[categories],
	);

	return (
		<Card title="FAQ 등록">
			<Form
				form={form}
				layout="vertical"
				initialValues={{ isPublished: true }}
				onFinish={async (raw) => {
					const values: FaqCreateInput = {
						category: raw.category?.trim() ?? '',
						question: raw.question?.trim() ?? '',
						answer: raw.answer?.trim() ?? '',
						isPublished: !!raw.isPublished,
						order: raw.order,
						tags: raw.tagsCsv
							?.split(',')
							.map((s) => s.trim())
							.filter(Boolean),
					};
					await onSubmit(values);
					form.resetFields();
				}}
			>
				<Form.Item
					label="카테고리"
					name="category"
					tooltip={categoryHint}
					rules={[{ required: true, message: '카테고리를 입력하세요.' }]}
				>
					<Input placeholder="예) 가입/로그인" allowClear />
				</Form.Item>
				<Form.Item
					label="질문"
					name="question"
					rules={[{ required: true, message: '질문을 입력하세요.' }]}
				>
					<Input placeholder="예) 비밀번호를 잊어버렸어요. 어떻게 하나요?" allowClear />
				</Form.Item>
				<Form.Item
					label="답변"
					name="answer"
					rules={[{ required: true, message: '답변을 입력하세요.' }]}
				>
					<Input.TextArea placeholder="절차나 경로를 자세히 적어주세요." rows={8} />
				</Form.Item>
				<Space size={16} style={{ width: '100%' }}>
					<Form.Item label="공개" name="isPublished" valuePropName="checked">
						<Switch checkedChildren="공개" unCheckedChildren="비공개" />
					</Form.Item>
					<Form.Item label="정렬 우선순위" name="order" tooltip="작을수록 상단에 노출">
						<InputNumber min={0} style={{ width: 140 }} placeholder="예) 0" />
					</Form.Item>
					<Form.Item label="태그(콤마 구분)" name="tagsCsv" style={{ flex: 1 }}>
						<Input placeholder="예) 비밀번호, 로그인" allowClear />
					</Form.Item>
				</Space>
				<Space>
					<Button htmlType="submit" type="primary" loading={submitting}>
						저장
					</Button>
					<Button htmlType="reset" disabled={submitting}>
						초기화
					</Button>
				</Space>
			</Form>
		</Card>
	);
};
