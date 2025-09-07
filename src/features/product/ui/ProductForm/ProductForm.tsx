import React from 'react';
import {
	Form,
	Input,
	InputNumber,
	Select,
	Radio,
	Checkbox,
	Button,
	Card,
	Typography,
	Space,
	Divider,
	Row,
	Col,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Product, CreateProductData } from '@/entities/product/model/product';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
	onSubmit: (data: CreateProductData) => void;
	onCancel: () => void;
	initialData?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData }) => {
	const [form] = Form.useForm();
	const [discountRate, setDiscountRate] = React.useState<number>(0);
	const [finalPrice, setFinalPrice] = React.useState<number>(0);
	const [stockStatus, setStockStatus] = React.useState<'unlimited' | 'limited'>('unlimited');
	const [paymentGateway, setPaymentGateway] = React.useState({
		creditCard: 'galaxia' as 'galaxia' | 'danal',
		mobile: 'galaxia' as 'galaxia' | 'danal',
	});

	React.useEffect(() => {
		if (initialData) {
			const stockStatusValue = initialData.stockStatus || 'unlimited';
			const paymentGatewayValue = {
				creditCard: initialData.paymentGateway?.creditCard || 'galaxia',
				mobile: initialData.paymentGateway?.mobile || 'galaxia',
			};

			form.setFieldsValue({
				...initialData,
				paymentGateway: paymentGatewayValue,
				stockStatus: stockStatusValue,
			});
			setStockStatus(stockStatusValue);
			setPaymentGateway(paymentGatewayValue);
			setDiscountRate(initialData.discountRate || 0);
			setFinalPrice(initialData.finalPrice || initialData.salePrice);
		} else {
			// 새로 생성할 때 초기값 설정
			const defaultPaymentGateway = {
				creditCard: 'galaxia' as const,
				mobile: 'galaxia' as const,
			};

			form.setFieldsValue({
				stockStatus: 'unlimited',
				paymentGateway: defaultPaymentGateway,
			});
			setStockStatus('unlimited');
			setPaymentGateway(defaultPaymentGateway);
		}
	}, [initialData, form]);

	const handlePriceChange = (value: number | null) => {
		if (value && discountRate > 0) {
			setFinalPrice(value * (1 - discountRate / 100));
		} else {
			setFinalPrice(value || 0);
		}
	};

	const handleDiscountRateChange = (value: number | null) => {
		const price = form.getFieldValue('value') || 0;
		if (value && price > 0) {
			setDiscountRate(value);
			setFinalPrice(price * (1 - value / 100));
		} else {
			setDiscountRate(0);
			setFinalPrice(price);
		}
	};

	const handleSubmit = (values: any) => {
		const submitData: CreateProductData = {
			category: values.category,
			name: values.name,
			imageUrl: values.imageUrl,
			salePrice: values.salePrice,
			discountRate: values.discountRate || 0,
			finalPrice: values.finalPrice || values.salePrice,
			stockStatus: values.stockStatus,
			stockQuantity: values.stockQuantity,
			paymentGateway: paymentGateway,
			issuer: values.issuer,
			homepage: values.homepage,
			customerCenter: values.customerCenter,
			productInfo: values.productInfo,
			notes: values.notes,
			descriptionImageUrl: values.descriptionImageUrl,
		};

		onSubmit(submitData);
	};

	return (
		<Card>
			<Title level={3} style={{ marginBottom: '24px' }}>
				{initialData ? '상품 수정' : '상품 등록 (신규)'} (* 필수 입력 사항)
			</Title>

			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					discountRate: 0,
					finalPrice: 0,
					stockStatus: 'unlimited',
					paymentGateway: {
						creditCard: 'galaxia',
						mobile: 'galaxia',
					},
				}}
			>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item
							label="카테고리 *"
							name="category"
							rules={[{ required: true, message: '카테고리를 선택해주세요' }]}
						>
							<Select placeholder="카테고리를 선택하세요">
								<Option value="디지털">디지털</Option>
								<Option value="게임">게임</Option>
								<Option value="문화">문화</Option>
								<Option value="카페">카페</Option>
								<Option value="스트리밍">스트리밍</Option>
								<Option value="기타">기타</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label="상품명"
							name="name"
							rules={[{ required: true, message: '상품명을 입력해주세요' }]}
						>
							<Input placeholder="상품명을 입력하세요" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={24}>
						<Form.Item
							label="상품이미지"
							name="imageUrl"
							rules={[{ required: true, message: '상품 이미지를 등록해주세요' }]}
						>
							<div
								style={{
									border: '2px dashed #d9d9d9',
									borderRadius: '8px',
									padding: '40px',
									textAlign: 'center',
									cursor: 'pointer',
									background: '#fafafa',
								}}
							>
								<UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
								<div>상품 이미지 등록하기</div>
							</div>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={8}>
						<Form.Item
							label="판매금액"
							name="salePrice"
							rules={[{ required: true, message: '판매금액을 입력해주세요' }]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder="0"
								onChange={handlePriceChange}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="할인률(선택)" name="discountRate">
							<InputNumber
								style={{ width: '100%' }}
								placeholder="0"
								min={0}
								max={100}
								onChange={handleDiscountRateChange}
								addonAfter="%"
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="최종 판매금액 (할인률이 있는 경우 자동계산)" name="finalPrice">
							<InputNumber
								style={{ width: '100%' }}
								value={finalPrice}
								disabled
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={12}>
						<Form.Item label="재고현황" name="stockStatus">
							<Radio.Group
								value={stockStatus}
								onChange={(e) => {
									const value = e.target.value;
									setStockStatus(value);
									form.setFieldValue('stockStatus', value);
								}}
							>
								<Space direction="vertical">
									<Radio value="unlimited">재고무관</Radio>
									<Radio value="limited">재고수량 직접입력</Radio>
								</Space>
							</Radio.Group>
							{stockStatus === 'limited' && (
								<div style={{ marginTop: '8px' }}>
									<InputNumber
										placeholder="0"
										min={0}
										style={{ width: '120px' }}
										addonAfter="개"
										value={form.getFieldValue('stockQuantity')}
										onChange={(value) => form.setFieldValue('stockQuantity', value)}
									/>
								</div>
							)}
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="결제대행사 선택">
							<div>
								<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
									<Text strong style={{ width: '80px', textAlign: 'right' }}>
										신용카드:
									</Text>
									<Radio.Group
										value={paymentGateway.creditCard}
										onChange={(e) =>
											setPaymentGateway((prev) => ({ ...prev, creditCard: e.target.value }))
										}
										style={{ marginLeft: '16px' }}
									>
										<Radio value="galaxia">갤럭시아</Radio>
										<Radio value="danal">다날</Radio>
									</Radio.Group>
								</div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<Text strong style={{ width: '80px', textAlign: 'right' }}>
										휴대폰:
									</Text>
									<Radio.Group
										value={paymentGateway.mobile}
										onChange={(e) =>
											setPaymentGateway((prev) => ({ ...prev, mobile: e.target.value }))
										}
										style={{ marginLeft: '16px' }}
									>
										<Radio value="galaxia">갤럭시아</Radio>
										<Radio value="danal">다날</Radio>
									</Radio.Group>
								</div>
							</div>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={8}>
						<Form.Item label="발행업체" name="issuer">
							<Input placeholder="발행업체를 입력하세요" />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="홈페이지" name="homepage">
							<Input placeholder="홈페이지 URL을 입력하세요" />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="고객센터" name="customerCenter">
							<Input placeholder="고객센터 연락처를 입력하세요" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={24}>
						<Form.Item label="상품 정보" name="productInfo">
							<TextArea rows={4} placeholder="상품에 대한 상세 정보를 입력하세요" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col span={24}>
						<Form.Item label="유의 사항" name="notes">
							<TextArea rows={4} placeholder="상품 사용 시 유의사항을 입력하세요" />
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				<Row gutter={24}>
					<Col span={24}>
						<Title level={4}>상품설명 이미지 등록</Title>
						<div
							style={{
								border: '2px dashed #d9d9d9',
								borderRadius: '8px',
								padding: '40px',
								textAlign: 'center',
								cursor: 'pointer',
								background: '#fafafa',
							}}
						>
							<UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
							<div>상품설명 이미지 선택</div>
						</div>
					</Col>
				</Row>

				<Divider />

				<Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
					<Space size="middle">
						<Button size="large" onClick={onCancel}>
							취소
						</Button>
						<Button type="primary" htmlType="submit" size="large">
							{initialData ? '수정' : '등록'}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};
