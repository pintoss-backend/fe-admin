import React from 'react';
import { Form, Input, InputNumber, Button, Typography, Upload, message, Card, Space } from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { CreateIssuerData } from '@/entities/product/model/product';
import { useProductStore } from '@/entities/product/store/productStore';
import { AppLayout } from '@/shared/ui/Layout';
import { QuillEditor } from '@/shared/ui/QuillEditor';

const { Text, Title } = Typography;
const { TextArea } = Input;

export const IssuerCreate: React.FC = () => {
	const navigate = useNavigate();
	const { addIssuer } = useProductStore();
	const [form] = Form.useForm();

	const [paymentMethods, setPaymentMethods] = React.useState<
		Array<{ paymentMethod: string; discountRate: number }>
	>([
		{ paymentMethod: '계좌이체', discountRate: 0 },
		{ paymentMethod: '신용카드', discountRate: 0 },
	]);

	const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string>('');
	const [uploadedDescriptionImageUrl, setUploadedDescriptionImageUrl] = React.useState<string>('');
	const [uploadedFileMetadata, setUploadedFileMetadata] = React.useState<{
		name: string;
		size: number;
	} | null>(null);
	const [uploadedDescriptionFileMetadata, setUploadedDescriptionFileMetadata] = React.useState<{
		name: string;
		size: number;
	} | null>(null);
	const [noticeValue, setNoticeValue] = React.useState<string>('');
	const [productInfoValue, setProductInfoValue] = React.useState<string>('');

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const handleAddPaymentMethod = () => {
		setPaymentMethods((prev) => [...prev, { paymentMethod: '', discountRate: 0 }]);
	};

	const handleRemovePaymentMethod = (index: number) => {
		setPaymentMethods((prev) => prev.filter((_, i) => i !== index));
	};

	const handlePaymentMethodChange = (
		index: number,
		field: 'paymentMethod' | 'discountRate',
		value: string | number,
	) => {
		setPaymentMethods((prev) =>
			prev.map((pm, i) => (i === index ? { ...pm, [field]: value } : pm)),
		);
	};

	const handleImageUpload = (file: any, _fileList?: any[], isDescription = false) => {
		const isImage = file.type.startsWith('image/');
		if (!isImage) {
			message.error('이미지 파일만 업로드 가능합니다.');
			return false;
		}

		const isLt10M = file.size / 1024 / 1024 < 10;
		if (!isLt10M) {
			message.error('이미지는 10MB 이하여야 합니다.');
			return false;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const imageUrl = e.target?.result as string;
			console.log('생성된 미리보기 URL 길이:', imageUrl.length);

			if (isDescription) {
				setUploadedDescriptionImageUrl(imageUrl);
				setUploadedDescriptionFileMetadata({
					name: file.name,
					size: file.size,
				});
			} else {
				setUploadedImageUrl(imageUrl);
				setUploadedFileMetadata({
					name: file.name,
					size: file.size,
				});
			}
		};
		reader.readAsDataURL(file);

		return false; // Prevent upload
	};

	const handleSubmit = (values: any) => {
		console.log('폼 제출 시 values:', values);
		console.log('업로드된 이미지 URL:', uploadedImageUrl);
		console.log('업로드된 상품설명 이미지 URL:', uploadedDescriptionImageUrl);

		const formData: CreateIssuerData = {
			name: values.name,
			description: values.description,
			fee: values.fee,
			notice: noticeValue,
			productInfo: productInfoValue,
			phoneNumber: values.phoneNumber,
			homepage: values.homepage,
			imageUrl: uploadedImageUrl || values.imageUrl || '',
			descriptionImageUrl: uploadedDescriptionImageUrl || values.descriptionImageUrl || '',
			paymentMethods: paymentMethods.filter((pm) => pm.paymentMethod.trim() !== ''),
		};

		console.log('최종 제출 데이터:', formData);
		addIssuer(formData);
		message.success('발행사가 성공적으로 등록되었습니다.');
		navigate('/products');
	};

	const handleCancel = () => {
		navigate('/products');
	};

	return (
		<AppLayout title="발행사 등록" mobileTitle="발행사 등록">
			<div style={{ maxWidth: '800px', margin: '0 auto' }}>
				<div style={{ marginBottom: 16 }}>
					<Button
						type="text"
						icon={<ArrowLeftOutlined />}
						onClick={handleCancel}
						style={{
							color: '#1890ff',
							fontWeight: 500,
							padding: '8px 16px',
							height: 'auto',
							borderRadius: '6px',
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = '#f0f8ff';
							e.currentTarget.style.color = '#096dd9';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent';
							e.currentTarget.style.color = '#1890ff';
						}}
					>
						뒤로가기
					</Button>
				</div>
				<Card>
					<Form form={form} layout="vertical" onFinish={handleSubmit} size="middle">
						{/* 기본 정보 */}
						<div style={{ marginBottom: 32 }}>
							<Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
								기본 정보
							</Title>

							{/* 발행사명 */}
							<Form.Item
								label="발행사명"
								name="name"
								rules={[{ required: true, message: '발행사명을 입력해주세요.' }]}
							>
								<Input placeholder="예: 문화상품권" autoComplete="off" />
							</Form.Item>

							{/* 발행사 설명 */}
							<Form.Item
								label="발행사 설명"
								name="description"
								rules={[{ required: true, message: '발행사 설명을 입력해주세요.' }]}
							>
								<TextArea
									placeholder="발행사에 대한 설명을 입력해주세요."
									rows={4}
									autoComplete="off"
								/>
							</Form.Item>

							{/* 수수료 */}
							<Form.Item
								label="수수료"
								name="fee"
								rules={[{ required: true, message: '수수료를 입력해주세요.' }]}
							>
								<InputNumber
									placeholder="수수료"
									min={0}
									max={100}
									suffix="%"
									style={{ width: '100%' }}
									autoComplete="off"
								/>
							</Form.Item>

							{/* 홈페이지 URL */}
							<Form.Item
								label="홈페이지 URL"
								name="homepage"
								rules={[{ type: 'url', message: '올바른 URL 형식이 아닙니다.' }]}
							>
								<Input placeholder="https://example.com" autoComplete="off" />
							</Form.Item>

							{/* 고객센터 */}
							<Form.Item
								label="고객센터"
								name="phoneNumber"
								rules={[{ pattern: /^[0-9-+()\s]+$/, message: '올바른 전화번호 형식이 아닙니다.' }]}
							>
								<Input placeholder="예: 1588-1234" autoComplete="off" />
							</Form.Item>
						</div>

						{/* 상세 내용 */}
						<div style={{ marginBottom: 32 }}>
							<Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
								상세 내용
							</Title>

							{/* 유의사항 */}
							<Form.Item
								label="유의사항"
								rules={[{ required: true, message: '유의사항을 입력해주세요.' }]}
							>
								<QuillEditor
									value={noticeValue}
									onChange={setNoticeValue}
									placeholder="유의사항을 입력해주세요."
									height={200}
								/>
							</Form.Item>

							{/* 상품정보 */}
							<Form.Item
								label="상품정보"
								rules={[{ required: true, message: '상품정보를 입력해주세요.' }]}
							>
								<QuillEditor
									value={productInfoValue}
									onChange={setProductInfoValue}
									placeholder="상품정보를 입력해주세요."
									height={200}
								/>
							</Form.Item>
						</div>

						{/* 이미지 */}
						<div style={{ marginBottom: 32 }}>
							<Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
								이미지
							</Title>

							{/* 발행사 이미지 */}
							<Form.Item label="발행사 이미지">
								<Upload.Dragger
									beforeUpload={handleImageUpload}
									showUploadList={false}
									accept="image/*"
									style={{
										backgroundColor: uploadedImageUrl ? '#f6ffed' : '#fafafa',
										border: uploadedImageUrl ? '1px solid #b7eb8f' : '1px dashed #d9d9d9',
									}}
								>
									<p className="ant-upload-drag-icon">
										<InboxOutlined style={{ color: uploadedImageUrl ? '#52c41a' : '#1890ff' }} />
									</p>
									<p className="ant-upload-text">
										{uploadedImageUrl ? (
											<Text strong style={{ color: '#52c41a' }}>
												{uploadedFileMetadata ? '✓ 이미지 업로드 완료' : '✓ 기존 이미지'}
											</Text>
										) : (
											<Text>클릭하거나 파일을 드래그하여 업로드</Text>
										)}
									</p>
									{uploadedFileMetadata && (
										<p className="ant-upload-hint">
											<Text type="secondary" style={{ fontSize: 12 }}>
												파일명: {uploadedFileMetadata.name} (
												{formatFileSize(uploadedFileMetadata.size)})
											</Text>
										</p>
									)}
								</Upload.Dragger>
								{uploadedImageUrl && (
									<div style={{ marginTop: 16, textAlign: 'center' }}>
										<img
											src={uploadedImageUrl}
											alt="미리보기"
											style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
										/>
									</div>
								)}
							</Form.Item>

							{/* 상품설명이미지 URL */}
							<Form.Item label="상품설명이미지 URL">
								<Upload.Dragger
									beforeUpload={(file) => handleImageUpload(file, undefined, true)}
									showUploadList={false}
									accept="image/*"
									style={{
										backgroundColor: uploadedDescriptionImageUrl ? '#f6ffed' : '#fafafa',
										border: uploadedDescriptionImageUrl
											? '1px solid #b7eb8f'
											: '1px dashed #d9d9d9',
									}}
								>
									<p className="ant-upload-drag-icon">
										<InboxOutlined
											style={{ color: uploadedDescriptionImageUrl ? '#52c41a' : '#1890ff' }}
										/>
									</p>
									<p className="ant-upload-text">
										{uploadedDescriptionImageUrl ? (
											<Text strong style={{ color: '#52c41a' }}>
												{uploadedDescriptionFileMetadata ? '✓ 이미지 업로드 완료' : '✓ 기존 이미지'}
											</Text>
										) : (
											<Text>클릭하거나 파일을 드래그하여 업로드</Text>
										)}
									</p>
									{uploadedDescriptionFileMetadata && (
										<p className="ant-upload-hint">
											<Text type="secondary" style={{ fontSize: 12 }}>
												파일명: {uploadedDescriptionFileMetadata.name} (
												{formatFileSize(uploadedDescriptionFileMetadata.size)})
											</Text>
										</p>
									)}
								</Upload.Dragger>
								{uploadedDescriptionImageUrl && (
									<div style={{ marginTop: 16, textAlign: 'center' }}>
										<img
											src={uploadedDescriptionImageUrl}
											alt="상품설명 이미지 미리보기"
											style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
										/>
									</div>
								)}
							</Form.Item>
						</div>

						{/* 결제 수단 설정 */}
						<div style={{ marginBottom: 32 }}>
							<Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
								결제 수단 설정
							</Title>

							<Form.Item label="결제 수단">
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									{paymentMethods.map((pm, index) => (
										<div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
											<Input
												placeholder="결제 수단명"
												value={pm.paymentMethod}
												onChange={(e) =>
													handlePaymentMethodChange(index, 'paymentMethod', e.target.value)
												}
												style={{ flex: 1 }}
											/>
											<InputNumber
												placeholder="할인율"
												min={0}
												max={100}
												suffix="%"
												value={pm.discountRate}
												onChange={(value) =>
													handlePaymentMethodChange(index, 'discountRate', value || 0)
												}
												style={{ width: 120 }}
											/>
											<Button
												type="text"
												danger
												onClick={() => handleRemovePaymentMethod(index)}
												disabled={paymentMethods.length <= 1}
											>
												삭제
											</Button>
										</div>
									))}
									<Button type="dashed" onClick={handleAddPaymentMethod} size="small">
										+ 결제 수단 추가
									</Button>
								</div>
							</Form.Item>
						</div>

						{/* 버튼 */}
						<Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
							<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
								<Button onClick={handleCancel}>취소</Button>
								<Button type="primary" htmlType="submit">
									발행사 등록
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</AppLayout>
	);
};
