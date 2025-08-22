import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth/store/authStore';
import type { LoginFormData } from '@/shared/types/auth';
import * as styles from './LoginForm.css';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
	const { login, isLoading } = useAuthStore();
	const [form] = Form.useForm();

	const handleSubmit = async (values: LoginFormData) => {
		try {
			await login(values.email, values.password);
			message.success('로그인 성공!', 1.5);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
			message.error(errorMessage, 2);
		}
	};

	const VALIDATION_RULES = {
		email: [
			{ required: true, message: '이메일을 입력해주세요' },
			{ type: 'email' as const, message: '이메일 형식이 올바르지 않습니다' },
		],
		password: [
			{ required: true, message: '비밀번호를 입력해주세요' },
			{ min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' },
		],
	};

	return (
		<div className={styles.LoginFormContainer}>
			<Card className={styles.LoginFormCard}>
				<div className={styles.LoginFormTitle}>
					<Title level={2} style={{ marginBottom: 8 }}>
						관리자 로그인
					</Title>
					<Text type="secondary">계정 정보를 입력하여 로그인하세요</Text>
				</div>

				<Form form={form} name="login" onFinish={handleSubmit} autoComplete="off" layout="vertical">
					<Form.Item name="email" label="이메일" rules={VALIDATION_RULES.email}>
						<Input prefix={<UserOutlined />} placeholder="이메일을 입력하세요" size="large" />
					</Form.Item>

					<Form.Item name="password" label="비밀번호" rules={VALIDATION_RULES.password}>
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

				<div className={styles.LoginFormFooter}>
					<Text type="secondary" style={{ fontSize: 12 }}>
						테스트 계정: admin@example.com / password123
					</Text>
				</div>
			</Card>
		</div>
	);
};
