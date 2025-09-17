import React from 'react';
import { Form, Input, InputNumber, Button, Modal, Typography, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { CreateIssuerData } from '@/entities/product/model/product';

const { Text } = Typography;

interface IssuerFormProps {
	visible: boolean;
	onSubmit: (data: CreateIssuerData) => void;
	onCancel: () => void;
	initialData?: any;
}

export const IssuerForm: React.FC<IssuerFormProps> = ({
	visible,
	onSubmit,
	onCancel,
	initialData,
}) => {
	const [form] = Form.useForm();
	const [paymentMethods, setPaymentMethods] = React.useState<
		Array<{ paymentMethod: string; discountRate: number }>
	>([
		{ paymentMethod: '신용카드', discountRate: 0 },
		{ paymentMethod: '계좌이체', discountRate: 0 },
	]);
	const [currentStep, setCurrentStep] = React.useState(1);
	const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string>('');
	const [uploadedFileMetadata, setUploadedFileMetadata] = React.useState<{
		name: string;
		size: number;
	} | null>(null);
	const [isProcessingFile, setIsProcessingFile] = React.useState<boolean>(false);

	// 각 필드의 값을 독립적으로 관리
	const [nameValue, setNameValue] = React.useState<string>('');
	const [phoneNumberValue, setPhoneNumberValue] = React.useState<string>('');
	const [homepageValue, setHomepageValue] = React.useState<string>('');

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const scrollToBottom = () => {
		setTimeout(() => {
			// 모달의 실제 스크롤 컨테이너 찾기
			const modalBody = document.querySelector('.ant-modal-body');
			if (modalBody) {
				modalBody.scrollTo({
					top: modalBody.scrollHeight,
					behavior: 'smooth',
				});
				console.log('스크롤 실행됨:', modalBody.scrollHeight);
			} else {
				console.log('모달 바디를 찾을 수 없음');
			}
		}, 300);
	};

	const scrollToTop = () => {
		setTimeout(() => {
			// 모달의 실제 스크롤 컨테이너 찾기
			const modalBody = document.querySelector('.ant-modal-body');
			if (modalBody) {
				modalBody.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
				console.log('스크롤 맨 위로 이동');
			}
		}, 100);
	};

	// 팝업이 열릴 때마다 초기화 (편집 모드가 아닐 때만)
	React.useEffect(() => {
		if (visible && !initialData) {
			form.resetFields();
			setPaymentMethods([
				{ paymentMethod: '신용카드', discountRate: 0 },
				{ paymentMethod: '계좌이체', discountRate: 0 },
			]);
			setCurrentStep(1);
			setUploadedImageUrl('');
			setUploadedFileMetadata(null);
			setIsProcessingFile(false);
			// 등록 모드에서는 필드 값 초기화
			setNameValue('');
			setPhoneNumberValue('');
			setHomepageValue('');
		} else if (visible && initialData) {
			// 편집 모드일 때는 폼을 리셋하고 다시 설정
			form.resetFields();
			setUploadedImageUrl(initialData.imageUrl || '');
			setUploadedFileMetadata(null);
			setIsProcessingFile(false);
			// 편집 모드에서는 기존 값으로 설정
			setNameValue(initialData.name || '');
			setPhoneNumberValue(initialData.phoneNumber || '');
			setHomepageValue(initialData.homepage || '');
			// 편집 모드일 때는 모든 단계 표시
			setCurrentStep(5);
			// 편집 모드에서는 스크롤을 맨 위로
			scrollToTop();
		}
	}, [visible, form, initialData]);

	// 편집 모드일 때 데이터 설정
	React.useEffect(() => {
		if (initialData && visible) {
			console.log('편집 데이터:', initialData); // 디버깅용
			console.log('현재 currentStep:', currentStep); // 디버깅용

			// 폼 필드 설정 - 즉시 실행
			const formData = {
				name: initialData.name,
				phoneNumber: initialData.phoneNumber,
				homepage: initialData.homepage,
				imageUrl: initialData.imageUrl,
			};
			console.log('설정할 폼 데이터:', formData);
			console.log('phoneNumber 값:', initialData.phoneNumber);
			console.log('homepage 값:', initialData.homepage);

			// 폼 값 설정
			form.setFieldsValue(formData);
			console.log('폼 값 설정 후:', form.getFieldsValue());

			// 추가로 각 필드별로 개별 설정도 시도
			form.setFieldValue('name', initialData.name);
			form.setFieldValue('phoneNumber', initialData.phoneNumber);
			form.setFieldValue('homepage', initialData.homepage);
			form.setFieldValue('imageUrl', initialData.imageUrl);
			console.log('개별 필드 설정 후:', form.getFieldsValue());

			if (initialData.paymentMethods) {
				setPaymentMethods(initialData.paymentMethods);
			}
			// 편집 모드일 때는 모든 단계 표시
			setCurrentStep(5);
		}
	}, [initialData, form, visible]);

	// 이미지 업로드 완료 시 스크롤을 아래로 (등록 모드에서만)
	React.useEffect(() => {
		if (uploadedImageUrl && !initialData) {
			scrollToBottom();
		}
	}, [uploadedImageUrl, initialData]);

	// 컴포넌트 언마운트 시 타이머 정리
	React.useEffect(() => {
		return () => {
			if (nameDebounceTimer) {
				clearTimeout(nameDebounceTimer);
			}
			if (phoneDebounceTimer) {
				clearTimeout(phoneDebounceTimer);
			}
			if (homepageDebounceTimer) {
				clearTimeout(homepageDebounceTimer);
			}
		};
	}, []);

	const handleAddPaymentMethod = () => {
		setPaymentMethods((prev) => [...prev, { paymentMethod: '', discountRate: 0 }]);
		// 결제수단 추가 후 스크롤을 아래로
		scrollToBottom();
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

	const handleImageUpload = (info: any) => {
		const { status, file } = info;
		console.log('=== 이미지 업로드 시작 ===');
		console.log('status:', status);
		console.log('file:', file);
		console.log('isProcessingFile:', isProcessingFile);

		// 이미 처리 중이면 중복 처리 방지
		if (isProcessingFile) {
			console.log('이미 처리 중이므로 중복 처리 방지');
			return;
		}

		if (status === 'uploading') {
			console.log('업로딩 중...');
			return;
		}

		if (status === 'done' || (status === undefined && file && file.originFileObj)) {
			console.log('업로드 완료 또는 undefined 상태, 미리보기 생성 시작');
			setIsProcessingFile(true);

			// 파일을 FileReader로 읽어서 미리보기용 URL 생성
			const actualFile = file.originFileObj || file;
			console.log('실제 파일 객체:', actualFile);

			if (actualFile) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const imageUrl = e.target?.result as string;
					console.log('생성된 미리보기 URL 길이:', imageUrl.length);
					console.log('미리보기 URL 앞부분:', imageUrl.substring(0, 50) + '...');
					setUploadedImageUrl(imageUrl);

					console.log('파일 타입:', actualFile.type);
					console.log('파일 크기:', actualFile.size);
					console.log('파일명:', actualFile.name);

					form.setFieldValue('imageFile', actualFile);
					setUploadedFileMetadata({ name: file.name, size: file.size });

					// 폼 값 확인
					const formValues = form.getFieldsValue();
					console.log('폼 값 설정 후:', formValues);
					console.log('imageFile이 폼에 있는가?', !!formValues.imageFile);

					message.success('이미지가 성공적으로 업로드되었습니다.');
					setIsProcessingFile(false);
				};
				reader.onerror = (e) => {
					console.error('FileReader 에러:', e);
					message.error('이미지 읽기에 실패했습니다.');
					setIsProcessingFile(false);
				};
				reader.readAsDataURL(actualFile);
			} else {
				console.error('파일 객체를 찾을 수 없음');
				message.error('파일을 읽을 수 없습니다.');
				setIsProcessingFile(false);
			}
		} else if (status === 'error') {
			console.error('업로드 에러:', info);
			message.error('이미지 업로드에 실패했습니다.');
		}
	};

	const uploadProps = {
		name: 'file',
		multiple: false,
		accept: 'image/*',
		showUploadList: false,
		customRequest: (options: any) => {
			const { file, onSuccess, onError } = options;
			console.log('=== customRequest 시작 ===');
			console.log('받은 파일:', file);
			console.log('파일 타입:', file.type);
			console.log('파일 크기:', file.size);

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
		onChange: handleImageUpload,
	};

	// debounce를 위한 타이머들
	const [nameDebounceTimer, setNameDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);
	const [phoneDebounceTimer, setPhoneDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);
	const [homepageDebounceTimer, setHomepageDebounceTimer] = React.useState<NodeJS.Timeout | null>(
		null,
	);

	const handleFormChange = (changedValues: any) => {
		// 발행사명 입력 시 debounce 적용
		if (changedValues.name && currentStep === 1) {
			// 기존 타이머가 있으면 클리어
			if (nameDebounceTimer) {
				clearTimeout(nameDebounceTimer);
			}

			// 새로운 타이머 설정 (500ms 후 실행)
			const timer = setTimeout(() => {
				setCurrentStep(2);
				scrollToBottom();
			}, 500);
			setNameDebounceTimer(timer);
		}

		// 전화번호 입력 시 debounce 적용
		if (changedValues.phoneNumber && currentStep === 2) {
			// 기존 타이머가 있으면 클리어
			if (phoneDebounceTimer) {
				clearTimeout(phoneDebounceTimer);
			}

			// 새로운 타이머 설정 (500ms 후 실행)
			const timer = setTimeout(() => {
				setCurrentStep(3);
				scrollToBottom();
			}, 500);
			setPhoneDebounceTimer(timer);
		}

		// 홈페이지 입력 시 debounce 적용
		if (changedValues.homepage && currentStep === 3) {
			// 기존 타이머가 있으면 클리어
			if (homepageDebounceTimer) {
				clearTimeout(homepageDebounceTimer);
			}

			// 새로운 타이머 설정 (500ms 후 실행)
			const timer = setTimeout(() => {
				setCurrentStep(4);
				scrollToBottom();
			}, 500);
			setHomepageDebounceTimer(timer);
		}

		// imageUrl은 선택사항이므로 입력하거나 포커스 아웃 시 다음 단계로
		if (changedValues.imageUrl !== undefined && currentStep === 4) {
			setCurrentStep(5);
			scrollToBottom();
		}
	};

	const handleSubmit = (values: any) => {
		console.log('폼 제출 시 values:', values);
		console.log('업로드된 이미지 URL:', uploadedImageUrl);
		console.log('이미지 파일:', values.imageFile);

		const formData: CreateIssuerData & { imageFile?: File } = {
			name: values.name,
			phoneNumber: values.phoneNumber,
			homepage: values.homepage,
			imageUrl: uploadedImageUrl || values.imageUrl || '', // 미리보기용 URL
			imageFile: values.imageFile, // 실제 파일 객체
			paymentMethods: paymentMethods.filter((pm) => pm.paymentMethod.trim() !== ''),
		};

		console.log('최종 제출 데이터:', formData);
		onSubmit(formData);
	};

	return (
		<Modal
			title={initialData ? '발행사 수정' : '발행사 등록'}
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={600}
			destroyOnHidden
			style={{ top: 20 }}
			styles={{
				body: {
					maxHeight: '85vh',
					overflowY: 'auto',
					padding: '24px',
				},
			}}
		>
			<div style={{ marginBottom: 16 }}>
				<Text type="secondary" style={{ fontSize: 14 }}>
					{initialData ? '기존 발행사 정보를 수정합니다.' : '새로운 상품권 발행사를 등록합니다.'}
				</Text>
			</div>

			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				onValuesChange={handleFormChange}
				size="middle"
			>
				{/* 1단계: 발행사명 */}
				<Form.Item
					label="발행사명"
					name="name"
					rules={[{ required: true, message: '발행사명을 입력해주세요.' }]}
				>
					<Input
						placeholder="예: 문화상품권"
						value={nameValue}
						onChange={(e) => {
							setNameValue(e.target.value);
							form.setFieldValue('name', e.target.value);
						}}
						autoComplete="off"
					/>
				</Form.Item>

				{/* 2단계: 고객센터 전화번호 */}
				{(currentStep >= 2 || initialData) && (
					<Form.Item
						label="고객센터 전화번호"
						name="phoneNumber"
						rules={[
							{
								pattern: /^[\d\-\s\(\)\+]+$/,
								message: '올바른 전화번호 형식이 아닙니다.',
							},
						]}
					>
						<div style={{ display: 'flex', gap: 8 }}>
							<Input
								placeholder="예: 1588-1234 (선택사항)"
								value={phoneNumberValue}
								onChange={(e) => {
									setPhoneNumberValue(e.target.value);
									form.setFieldValue('phoneNumber', e.target.value);
								}}
								style={{ flex: 1 }}
								autoComplete="off"
							/>
							{!initialData && (
								<Button
									type="dashed"
									onClick={() => {
										setCurrentStep(3);
										scrollToBottom();
									}}
									style={{ whiteSpace: 'nowrap' }}
								>
									건너뛰기
								</Button>
							)}
						</div>
					</Form.Item>
				)}

				{/* 3단계: 홈페이지 URL */}
				{(currentStep >= 3 || initialData) && (
					<Form.Item
						label="홈페이지 URL"
						name="homepage"
						rules={[{ type: 'url', message: '올바른 URL 형식이 아닙니다.' }]}
					>
						<div style={{ display: 'flex', gap: 8 }}>
							<Input
								placeholder="https://example.com (선택사항)"
								value={homepageValue}
								onChange={(e) => {
									setHomepageValue(e.target.value);
									form.setFieldValue('homepage', e.target.value);
								}}
								style={{ flex: 1 }}
								autoComplete="off"
							/>
							{!initialData && (
								<Button
									type="dashed"
									onClick={() => {
										setCurrentStep(4);
										scrollToBottom();
									}}
									style={{ whiteSpace: 'nowrap' }}
								>
									건너뛰기
								</Button>
							)}
						</div>
					</Form.Item>
				)}

				{/* 4단계: 발행사 이미지 */}
				{(currentStep >= 4 || initialData) && (
					<Form.Item label="발행사 이미지" name="imageUrl">
						<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
							{/* 드래그앤드롭 업로드 영역 */}
							<Upload.Dragger
								{...uploadProps}
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

							{/* 건너뛰기 버튼 (등록 모드에서만) */}
							{!initialData && (
								<div style={{ textAlign: 'center' }}>
									<Button
										type="dashed"
										onClick={() => {
											setCurrentStep(5);
											scrollToBottom();
										}}
									>
										이미지 없이 건너뛰기
									</Button>
								</div>
							)}
						</div>
					</Form.Item>
				)}

				{/* 5단계: 결제 수단별 할인률 */}
				{(currentStep >= 5 || initialData) && (
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
				)}

				{/* 버튼은 마지막 단계에서만 표시 */}
				{(currentStep >= 5 || initialData) && (
					<Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<Button onClick={onCancel}>취소</Button>
							<Button type="primary" htmlType="submit">
								{initialData ? '발행사 수정' : '발행사 등록'}
							</Button>
						</div>
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
};
