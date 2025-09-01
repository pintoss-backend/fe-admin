import type { Member } from '../model';
// 임시 데이터
// 추후 실제 api로 대체 필요

const seed: Member[] = [
	{
		id: 'U0001',
		name: '구태형',
		phone: '010-1234-5678',
		joinedAt: '2025-06-03T09:12:00Z',
		lastLoginAt: '2025-08-28T12:10:00Z',
		signupIp: '211.201.11.31',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0002',
		name: '권정',
		phone: '010-2222-1111',
		joinedAt: '2025-05-28T02:03:00Z',
		lastLoginAt: '2025-08-17T22:30:00Z',
		signupIp: '61.75.210.5',
		isBlocked: true,
		isWithdrawn: false,
	},
	{
		id: 'U0003',
		name: '이상해씨',
		phone: '010-3333-4444',
		joinedAt: '2025-05-10T11:44:00Z',
		lastLoginAt: '2025-08-20T08:03:00Z',
		signupIp: '125.134.19.201',
		isBlocked: false,
		isWithdrawn: true,
	},
	{
		id: 'U0004',
		name: '피카츄',
		phone: '010-9999-0000',
		joinedAt: '2025-03-10T04:20:00Z',
		lastLoginAt: '2025-08-29T15:00:00Z',
		signupIp: '183.32.91.7',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0005',
		name: '권줄리',
		phone: '010-5555-6666',
		joinedAt: '2025-04-16T18:30:00Z',
		lastLoginAt: '2025-08-15T01:11:00Z',
		signupIp: '175.112.2.35',
		isBlocked: true,
		isWithdrawn: false,
	},
	{
		id: 'U0006',
		name: '장원영',
		phone: '010-7777-2222',
		joinedAt: '2025-02-01T10:00:00Z',
		lastLoginAt: '2025-08-11T05:00:00Z',
		signupIp: '59.6.101.21',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0007',
		name: '카리나',
		phone: '010-6666-8888',
		joinedAt: '2025-07-01T09:00:00Z',
		lastLoginAt: '2025-08-29T02:41:00Z',
		signupIp: '119.203.77.10',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0008',
		name: '설윤',
		phone: '010-1212-3434',
		joinedAt: '2025-01-25T15:45:00Z',
		lastLoginAt: '2025-08-27T23:13:00Z',
		signupIp: '14.51.221.1',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0009',
		name: '권호떡',
		phone: '010-4242-7575',
		joinedAt: '2025-01-18T12:01:00Z',
		lastLoginAt: '2025-08-04T07:09:00Z',
		signupIp: '221.144.5.99',
		isBlocked: false,
		isWithdrawn: false,
	},
	{
		id: 'U0010',
		name: '권채영',
		phone: '010-0000-0000',
		joinedAt: '2025-06-20T22:00:00Z',
		lastLoginAt: '2025-08-29T14:22:00Z',
		signupIp: '106.245.32.11',
		isBlocked: false,
		isWithdrawn: false,
	},
];

export async function getMembers(): Promise<Member[]> {
	// const { data } = await api.get<Member[]>('/members');
	// return data;
	return Promise.resolve(seed);
}
