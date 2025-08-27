// 문의 내역 검색 영역 (Ant Design Form + Input)
import React from 'react';
import { Form, Input, Button } from 'antd';

export interface InquirySearchProps {
	keyword: string;
	onSearch: (keyword: string) => void;
}

const SearchSection: React.FC<InquirySearchProps> = ({ keyword, onSearch }) => {
	const [form] = Form.useForm();

	// keyword prop이 변경될 때 Input 값도 동기화
	React.useEffect(() => {
		form.setFieldsValue({ keyword });
	}, [keyword, form]);

	const handleFinish = (values: { keyword: string }) => {
		onSearch(values.keyword ?? '');
		// 검색 후 입력값 초기화 (원한다면)
		// form.resetFields();
	};

	return (
		<Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 24 }}>
			<Form.Item name="keyword" label="키워드 검색">
				<Input placeholder="제목 또는 내용" allowClear />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					검색
				</Button>
			</Form.Item>
		</Form>
	);
};

export default SearchSection;
