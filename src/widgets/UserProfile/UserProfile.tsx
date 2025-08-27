import { Typography, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/entities/auth';

const { Text } = Typography;

export const UserProfile: React.FC = () => {
	const { user } = useAuthStore();

	if (!user) return null;

	return (
		<Space>
			<Avatar icon={<UserOutlined />} />
			<Text>
				{user.name} ({user.email})
			</Text>
		</Space>
	);
};
