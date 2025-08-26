import {
	DashboardOutlined,
	UserOutlined,
	SettingOutlined,
	BellOutlined,
	QuestionCircleOutlined,
	MessageOutlined,
	MailOutlined,
	CreditCardOutlined,
} from '@ant-design/icons';

export const defaultMenuItems = [
	{
		key: 'dashboard',
		icon: <DashboardOutlined />,
		label: '대시보드',
	},
	{
		key: 'users',
		icon: <UserOutlined />,
		label: '회원 관리',
	},
	{
		key: 'payments',
		icon: <CreditCardOutlined />,
		label: '결제 내역',
	},
	{
		key: 'sms',
		icon: <MailOutlined />,
		label: 'SMS 관리',
	},
	{
		key: 'cs/notice',
		icon: <BellOutlined />,
		label: '공지사항',
	},
	{
		key: 'faq',
		icon: <QuestionCircleOutlined />,
		label: '자주 묻는 질문',
	},
	{
		key: 'inquiries',
		icon: <MessageOutlined />,
		label: '문의내역',
	},
	{
		key: 'settings',
		icon: <SettingOutlined />,
		label: '설정',
	},
];
