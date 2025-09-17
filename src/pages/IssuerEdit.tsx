import React from 'react';
import { Form, Input, InputNumber, Button, Typography, Upload, message, Card, Space } from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreateIssuerData, UpdateIssuerData } from '@/entities/product/model/product';
import { useProductStore } from '@/entities/product/store/productStore';
import { AppLayout } from '@/shared/ui/Layout';
import { QuillEditor } from '@/shared/ui/QuillEditor';

const { Text, Title } = Typography;
const { TextArea } = Input;

export const IssuerEdit: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { issuers, updateIssuer } = useProductStore();
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
	const [isProcessingFile, setIsProcessingFile] = React.useState<boolean>(false);
	const [isProcessingDescriptionFile, setIsProcessingDescriptionFile] =
		React.useState<boolean>(false);
	const [noticeValue, setNoticeValue] = React.useState<string>('');
	const [productInfoValue, setProductInfoValue] = React.useState<string>('');

	// 편집할 발행사 데이터 찾기
	const issuerData = React.useMemo(() => {
		return issuers.find((issuer) => issuer.id === parseInt(id || '0'));
	}, [issuers, id]);

	React.useEffect(() => {
		if (issuerData) {
			// 폼 데이터 설정
			form.setFieldsValue({
				name: issuerData.name,
				description: issuerData.description || '',
				fee: issuerData.fee || 0,
				phoneNumber: issuerData.phoneNumber || '',
				homepage: issuerData.homepage || '',
				imageUrl: issuerData.imageUrl || '',
				descriptionImageUrl: issuerData.descriptionImageUrl || '',
			});

			// 이미지 URL 설정
			setUploadedImageUrl(issuerData.imageUrl || '');
			setUploadedDescriptionImageUrl(issuerData.descriptionImageUrl || '');

			// 마크다운 값 설정
			setNoticeValue(issuerData.notice || '');
			setProductInfoValue(issuerData.productInfo || '');

			// 결제 수단 설정
			if (issuerData.paymentMethods && issuerData.paymentMethods.length > 0) {
				setPaymentMethods(issuerData.paymentMethods);
			}
		}
	}, [issuerData, form]);

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
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	const handleImageUpload = (info: any, isDescription = false) => {
		const { status, file } = info;
		console.log('=== 이미지 업로드 시작 ===');
		console.log('status:', status);
		console.log('file:', file);
		console.log('isDescription:', isDescription);

		// 이미 처리 중이면 중복 처리 방지
		if ((isDescription && isProcessingDescriptionFile) || (!isDescription && isProcessingFile)) {
			console.log('이미 처리 중이므로 중복 처리 방지');
			return;
		}

		if (status === 'uploading') {
			console.log('업로딩 중...');
			return;
		}

		if (status === 'done' || (status === undefined && file && file.originFileObj)) {
			console.log('업로드 완료 또는 undefined 상태, 미리보기 생성 시작');
			if (isDescription) {
				setIsProcessingDescriptionFile(true);
			} else {
				setIsProcessingFile(true);
			}

			// 파일을 FileReader로 읽어서 미리보기용 URL 생성
			const actualFile = file.originFileObj || file;
			console.log('실제 파일 객체:', actualFile);

			if (actualFile) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const imageUrl = e.target?.result as string;
					console.log('생성된 미리보기 URL 길이:', imageUrl.length);

					if (isDescription) {
						setUploadedDescriptionImageUrl(imageUrl);
						form.setFieldValue('descriptionImageFile', actualFile);
						setUploadedDescriptionFileMetadata({ name: file.name, size: file.size });
					} else {
						setUploadedImageUrl(imageUrl);
						form.setFieldValue('imageFile', actualFile);
						setUploadedFileMetadata({ name: file.name, size: file.size });
					}

					message.success('이미지가 성공적으로 업로드되었습니다.');
					if (isDescription) {
						setIsProcessingDescriptionFile(false);
					} else {
						setIsProcessingFile(false);
					}
				};
				reader.onerror = (e) => {
					console.error('FileReader 에러:', e);
					message.error('이미지 읽기에 실패했습니다.');
					if (isDescription) {
						setIsProcessingDescriptionFile(false);
					} else {
						setIsProcessingFile(false);
					}
				};
				reader.readAsDataURL(actualFile);
			} else {
				console.error('파일 객체를 찾을 수 없음');
				message.error('파일을 읽을 수 없습니다.');
				if (isDescription) {
					setIsProcessingDescriptionFile(false);
				} else {
					setIsProcessingFile(false);
				}
			}
		} else if (status === 'error') {
			console.error('업로드 에러:', info);
			message.error('이미지 업로드에 실패했습니다.');
		}
	};

	const createUploadProps = (isDescription = false) => ({
		name: 'file',
		multiple: false,
		accept: 'image/*',
		showUploadList: false,
		customRequest: (options: any) => {
			const { file, onSuccess, onError } = options;
			console.log('=== customRequest 시작 ===');
			console.log('받은 파일:', file);

			// 파일 검증
			const isImage = file.type.startsWith('image/');
			if (!isImage) {
				console.log('이미지 파일이 아님');
				onError(new Error('이미지 파일만 업로드 가능합니다.'));
				return;
			}

			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				console.log('파일 크기 초과');
				onError(new Error('이미지 크기는 10MB 이하여야 합니다.'));
				return;
			}

			console.log('파일 검증 통과, 성공 처리');
			// 즉시 성공 처리하여 미리보기 활성화
			onSuccess({ file });
		},
		onChange: (info: any) => handleImageUpload(info, isDescription),
	});

	const handleSubmit = (values: any) => {
		if (!issuerData) return;

		console.log('폼 제출 시 values:', values);
		console.log('업로드된 이미지 URL:', uploadedImageUrl);
		console.log('업로드된 상품설명 이미지 URL:', uploadedDescriptionImageUrl);

		const formData: UpdateIssuerData & { imageFile?: File; descriptionImageFile?: File } = {
			id: issuerData.id,
			name: values.name,
			description: values.description,
			fee: values.fee,
			notice: noticeValue,
			productInfo: productInfoValue,
			phoneNumber: values.phoneNumber,
			homepage: values.homepage,
			imageUrl: uploadedImageUrl || values.imageUrl || '',
			descriptionImageUrl: uploadedDescriptionImageUrl || values.descriptionImageUrl || '',
			imageFile: values.imageFile,
			descriptionImageFile: values.descriptionImageFile,
			paymentMethods: paymentMethods.filter((pm) => pm.paymentMethod.trim() !== ''),
		};

		console.log('최종 제출 데이터:', formData);
		updateIssuer(formData.id, formData);
		message.success('발행사가 성공적으로 수정되었습니다.');
		navigate('/products');
	};

	const handleCancel = () => {
		navigate('/products');
	};

	if (!issuerData) {
		return (
			<div style={{ padding: '24px', textAlign: 'center' }}>
				<Text>발행사를 찾을 수 없습니다.</Text>
			</div>
		);
	}

	return (
		<AppLayout title="발행사 수정" mobileTitle="발행사 수정">
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
								rules={[
									{
										pattern: /^[\d\-\s\(\)\+]+$/,
										message: '올바른 전화번호 형식이 아닙니다.',
									},
								]}
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

							{/* 상품이미지 URL */}
							<Form.Item label="상품이미지 URL" name="imageUrl">
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									{/* 드래그앤드롭 업로드 영역 */}
									<Upload.Dragger
										{...createUploadProps(false)}
										style={{
											backgroundColor: uploadedImageUrl ? '#f6ffed' : '#fafafa',
											border: uploadedImageUrl ? '1px solid #b7eb8f' : '1px dashed #d9d9d9',
										}}
									>
										<p className="ant-upload-drag-icon">
											<InboxOutlined style={{ color: uploadedImageUrl ? '#52c41a' : '#1890ff' }} />
										</p>
										<p
											className="ant-upload-text"
											style={{ color: uploadedImageUrl ? '#52c41a' : '#666' }}
										>
											{uploadedImageUrl
												? '새 이미지로 교체하려면 클릭하거나 드래그하세요'
												: '클릭하거나 파일을 드래그하여 업로드'}
										</p>
										<p className="ant-upload-hint">이미지 파일만 업로드 가능 (최대 10MB)</p>
									</Upload.Dragger>

									{/* 업로드된 이미지 미리보기 */}
									{uploadedImageUrl && (
										<div
											style={{
												textAlign: 'center',
												padding: '16px',
												backgroundColor: '#fafafa',
												borderRadius: '8px',
												border: '1px dashed #d9d9d9',
											}}
										>
											<div style={{ marginBottom: 12, textAlign: 'center' }}>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 8,
														marginBottom: 4,
														justifyContent: 'center',
													}}
												>
													<Text strong style={{ color: '#52c41a' }}>
														{uploadedFileMetadata ? '✓ 이미지 업로드 완료' : '✓ 기존 이미지'}
													</Text>
													{uploadedFileMetadata && (
														<Text type="secondary" style={{ fontSize: 12 }}>
															({formatFileSize(uploadedFileMetadata.size)})
														</Text>
													)}
												</div>
												{uploadedFileMetadata && (
													<Text type="secondary" style={{ fontSize: 12 }}>
														파일명: {uploadedFileMetadata.name}
													</Text>
												)}
											</div>
											<img
												src={uploadedImageUrl}
												alt="업로드된 이미지"
												style={{
													maxWidth: '100%',
													maxHeight: '200px',
													borderRadius: '8px',
													border: '1px solid #d9d9d9',
													objectFit: 'contain',
												}}
											/>
											<div style={{ marginTop: 12 }}>
												<Button
													type="link"
													danger
													size="small"
													onClick={() => {
														setUploadedImageUrl('');
														form.setFieldValue('imageUrl', '');
														form.setFieldValue('imageFile', null);
														setUploadedFileMetadata(null);
														setIsProcessingFile(false);
													}}
												>
													이미지 제거
												</Button>
											</div>
										</div>
									)}
								</div>
							</Form.Item>

							{/* 상품설명이미지 URL (선택사항) */}
							<Form.Item label="상품설명이미지 URL (선택사항)" name="descriptionImageUrl">
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									{/* 드래그앤드롭 업로드 영역 */}
									<Upload.Dragger
										{...createUploadProps(true)}
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
										<p
											className="ant-upload-text"
											style={{ color: uploadedDescriptionImageUrl ? '#52c41a' : '#666' }}
										>
											{uploadedDescriptionImageUrl
												? '새 이미지로 교체하려면 클릭하거나 드래그하세요'
												: '클릭하거나 파일을 드래그하여 업로드'}
										</p>
										<p className="ant-upload-hint">이미지 파일만 업로드 가능 (최대 10MB)</p>
									</Upload.Dragger>

									{/* 업로드된 이미지 미리보기 */}
									{uploadedDescriptionImageUrl && (
										<div
											style={{
												textAlign: 'center',
												padding: '16px',
												backgroundColor: '#fafafa',
												borderRadius: '8px',
												border: '1px dashed #d9d9d9',
											}}
										>
											<div style={{ marginBottom: 12, textAlign: 'center' }}>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 8,
														marginBottom: 4,
														justifyContent: 'center',
													}}
												>
													<Text strong style={{ color: '#52c41a' }}>
														{uploadedDescriptionFileMetadata
															? '✓ 이미지 업로드 완료'
															: '✓ 기존 이미지'}
													</Text>
													{uploadedDescriptionFileMetadata && (
														<Text type="secondary" style={{ fontSize: 12 }}>
															({formatFileSize(uploadedDescriptionFileMetadata.size)})
														</Text>
													)}
												</div>
												{uploadedDescriptionFileMetadata && (
													<Text type="secondary" style={{ fontSize: 12 }}>
														파일명: {uploadedDescriptionFileMetadata.name}
													</Text>
												)}
											</div>
											<img
												src={uploadedDescriptionImageUrl}
												alt="업로드된 상품설명 이미지"
												style={{
													maxWidth: '100%',
													maxHeight: '200px',
													borderRadius: '8px',
													border: '1px solid #d9d9d9',
													objectFit: 'contain',
												}}
											/>
											<div style={{ marginTop: 12 }}>
												<Button
													type="link"
													danger
													size="small"
													onClick={() => {
														setUploadedDescriptionImageUrl('');
														form.setFieldValue('descriptionImageUrl', '');
														form.setFieldValue('descriptionImageFile', null);
														setUploadedDescriptionFileMetadata(null);
														setIsProcessingDescriptionFile(false);
													}}
												>
													이미지 제거
												</Button>
											</div>
										</div>
									)}
								</div>
							</Form.Item>
						</div>

						{/* 결제 설정 */}
						<div style={{ marginBottom: 32 }}>
							<Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
								결제 설정
							</Title>

							{/* 결제 수단별 할인률 */}
							<Form.Item label="결제 수단별 할인률">
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									{paymentMethods.map((pm, index) => (
										<div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
											<Input
												placeholder="결제 수단"
												value={pm.paymentMethod}
												onChange={(e) =>
													handlePaymentMethodChange(index, 'paymentMethod', e.target.value)
												}
												style={{ flex: 1 }}
												autoComplete="off"
											/>
											<InputNumber
												placeholder="할인률"
												min={0}
												max={100}
												suffix="%"
												value={pm.discountRate}
												onChange={(value) =>
													handlePaymentMethodChange(index, 'discountRate', value || 0)
												}
												style={{ width: 100 }}
												autoComplete="off"
											/>
											<Button
												type="text"
												danger
												size="small"
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
									발행사 수정
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</AppLayout>
	);
};
