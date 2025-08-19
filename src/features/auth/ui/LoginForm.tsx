import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';
import type { LoginFormData } from '@/shared/types/auth';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
	const { login, isLoading } = useAuthStore();
	const [form] = Form.useForm();

	const onFinish = async (values: LoginFormData) => {
		try {
			// 로그인 시도
			await login(values.email, values.password);
			message.success('로그인 성공!', 1.5); // 1.5초간 표시
		} catch (error) {
			if (error instanceof Error) {
				message.error(error.message, 2); // 2초간 표시
			} else {
				message.error('로그인에 실패했습니다.', 2); // 2초간 표시
			}
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				width: '100vw',
				background: '#f0f2f5',
			}}
		>
			<Card
				style={{
					width: 400,
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 32 }}>
					<Title level={2} style={{ marginBottom: 8 }}>
						관리자 로그인
					</Title>
					<Text type="secondary">계정 정보를 입력하여 로그인하세요</Text>
				</div>

				<Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
					<Form.Item
						name="email"
						label="이메일"
						rules={[
							{
								required: true,
								message: '이메일을 입력해주세요',
							},
							{
								type: 'email',
								message: '올바른 이메일 형식이 아닙니다',
							},
						]}
					>
						<Input prefix={<UserOutlined />} placeholder="이메일을 입력하세요" size="large" />
					</Form.Item>

					<Form.Item
						name="password"
						label="비밀번호"
						rules={[
							{
								required: true,
								message: '비밀번호를 입력해주세요',
							},
							{
								min: 6,
								message: '비밀번호는 최소 6자 이상이어야 합니다',
							},
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="비밀번호를 입력하세요"
							size="large"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							loading={isLoading}
							style={{ width: '100%' }}
						>
							{isLoading ? '로그인 중...' : '로그인'}
						</Button>
					</Form.Item>
				</Form>

				<div style={{ textAlign: 'center', marginTop: 16 }}>
					<Text type="secondary" style={{ fontSize: 12 }}>
						테스트 계정: admin@example.com / password123
					</Text>
				</div>
			</Card>
		</div>
	);
};
