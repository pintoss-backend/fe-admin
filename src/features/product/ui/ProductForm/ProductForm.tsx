import React from 'react';
import { Form, Input, InputNumber, Select, Button, Modal, Typography } from 'antd';
import type { Product, CreateProductData } from '@/entities/product/model/product';
import { useProductStore } from '@/entities/product/store/productStore';

const { Text } = Typography;
const { Option } = Select;

interface ProductFormProps {
	visible: boolean;
	onSubmit: (data: CreateProductData & { issuerId: number }) => void;
	onCancel: () => void;
	initialData?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
	visible,
	onSubmit,
	onCancel,
	initialData,
}) => {
	const [form] = Form.useForm();
	const { issuers } = useProductStore();
	const [selectedIssuerId, setSelectedIssuerId] = React.useState<number | null>(null);
	const [currentStep, setCurrentStep] = React.useState(1);

	// debounce를 위한 타이머들
	const [nameDebounceTimer, setNameDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);
	const [priceDebounceTimer, setPriceDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

	// 팝업이 열릴 때마다 초기화 (편집 모드가 아닐 때만)
	React.useEffect(() => {
		if (visible && !initialData) {
			form.resetFields();
			setSelectedIssuerId(null);
			setCurrentStep(1);
		}
	}, [visible, form, initialData]);

	React.useEffect(() => {
		if (initialData && visible) {
			// 편집 모드일 때는 해당 상품의 발행사를 찾아서 설정
			const parentIssuer = issuers.find((issuer) =>
				issuer.products.some((product) => product.id === initialData.id),
			);

			console.log('편집할 상품:', initialData);
			console.log('찾은 발행사:', parentIssuer);

			if (parentIssuer) {
				setSelectedIssuerId(parentIssuer.id);
			}

			// 폼 필드 설정을 setTimeout으로 지연시켜 렌더링 완료 후 실행
			setTimeout(() => {
				form.setFieldsValue({
					...initialData,
					issuerId: parentIssuer?.id, // 발행사 ID도 폼에 설정
				});
				console.log('폼 값 설정 후:', form.getFieldsValue());
			}, 100);

			// 편집 모드일 때는 모든 단계 표시
			setCurrentStep(3);
		}
	}, [initialData, form, issuers, visible]);

	// 컴포넌트 언마운트 시 타이머 정리
	React.useEffect(() => {
		return () => {
			if (nameDebounceTimer) {
				clearTimeout(nameDebounceTimer);
			}
			if (priceDebounceTimer) {
				clearTimeout(priceDebounceTimer);
			}
		};
	}, []);

	const handleSubmit = (values: any) => {
		if (!selectedIssuerId) {
			// 에러 처리
			return;
		}

		const formData: CreateProductData & { issuerId: number } = {
			issuerId: selectedIssuerId,
			name: values.name,
			price: values.price,
		};

		onSubmit(formData);
	};

	const handleIssuerChange = (issuerId: number) => {
		setSelectedIssuerId(issuerId);
		if (currentStep === 1) {
			setCurrentStep(2);
		}
	};

	const selectedIssuer = issuers.find((issuer) => issuer.id === selectedIssuerId);

	return (
		<Modal
			title={initialData ? '상품권 수정' : '상품권 등록'}
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={600}
			destroyOnHidden
		>
			<div style={{ marginBottom: 16 }}>
				<Text type="secondary" style={{ fontSize: 14 }}>
					{initialData ? '기존 상품권 정보를 수정합니다.' : '새로운 상품권을 등록합니다.'}
				</Text>
			</div>

			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				onValuesChange={(changedValues) => {
					// 상품권명 입력 시 debounce 적용
					if (changedValues.name && currentStep === 2) {
						// 기존 타이머가 있으면 클리어
						if (nameDebounceTimer) {
							clearTimeout(nameDebounceTimer);
						}

						// 새로운 타이머 설정 (500ms 후 실행)
						const timer = setTimeout(() => {
							setCurrentStep(3);
						}, 500);
						setNameDebounceTimer(timer);
					}

					// 가격 입력 시 debounce 적용
					if (changedValues.price && currentStep === 3) {
						// 기존 타이머가 있으면 클리어
						if (priceDebounceTimer) {
							clearTimeout(priceDebounceTimer);
						}

						// 새로운 타이머 설정 (500ms 후 실행)
						const timer = setTimeout(() => {
							setCurrentStep(4);
						}, 500);
						setPriceDebounceTimer(timer);
					}
				}}
				size="middle"
			>
				{/* 1단계: 발행사 선택 */}
				{(currentStep >= 1 || initialData) && (
					<Form.Item
						label="발행사 선택"
						rules={[{ required: true, message: '발행사를 선택해주세요.' }]}
					>
						<Select
							placeholder="발행사를 선택하세요"
							value={selectedIssuerId}
							onChange={handleIssuerChange}
							style={{ width: '100%' }}
						>
							{issuers.map((issuer) => (
								<Option key={issuer.id} value={issuer.id}>
									{issuer.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				)}

				{/* 2단계: 발행사 정보 표시 */}
				{(currentStep >= 2 || initialData) && selectedIssuer && (
					<div
						style={{
							padding: 12,
							backgroundColor: '#f6f8fa',
							borderRadius: 6,
							marginBottom: 16,
							border: '1px solid #e1e4e8',
						}}
					>
						<Text strong style={{ fontSize: 14 }}>
							선택된 발행사: {selectedIssuer.name}
						</Text>
						<br />
						<Text type="secondary" style={{ fontSize: 12 }}>
							할인률:{' '}
							{selectedIssuer.paymentMethods
								.map((pm) => `${pm.paymentMethod} ${pm.discountRate}%`)
								.join(', ')}
						</Text>
					</div>
				)}

				{/* 2단계: 상품권명 */}
				{(currentStep >= 2 || initialData) && (
					<Form.Item
						label="상품권명"
						name="name"
						rules={[{ required: true, message: '상품권명을 입력해주세요.' }]}
					>
						<Input placeholder="예: 문화상품권 5,000원" autoComplete="off" />
					</Form.Item>
				)}

				{/* 3단계: 가격 */}
				{(currentStep >= 3 || initialData) && (
					<Form.Item
						label="가격"
						name="price"
						rules={[{ required: true, message: '가격을 입력해주세요.' }]}
					>
						<InputNumber
							placeholder="가격"
							min={0}
							style={{ width: '100%' }}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							autoComplete="off"
						/>
					</Form.Item>
				)}

				{/* 버튼은 마지막 단계에서만 표시 */}
				{(currentStep >= 4 || initialData) && (
					<Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<Button onClick={onCancel}>취소</Button>
							<Button type="primary" htmlType="submit" disabled={!selectedIssuerId}>
								{initialData ? '상품권 수정' : '상품권 등록'}
							</Button>
						</div>
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
};
