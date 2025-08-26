import { create } from 'zustand';
import type { Notice, CreateNoticeData } from '../model/notice';

interface NoticeStore {
	notices: Notice[];
	addNotice: (notice: CreateNoticeData) => void;
	removeNotice: (id: string) => void;
	updateNotice: (id: string, notice: Partial<Notice>) => void;
}

const mockNotices: Notice[] = [
	{
		id: '1',
		title: '핀토스 정기 회의 안내',
		content: '2025년 8월 27일 오후 9시 정기 회의가 예정되어 있습니다.',
		date: '2025-08-27',
		priority: 'high',
	},
	{
		id: '2',
		title: '새로운 기능 업데이트',
		content: '관리자 대시보드에 새로운 통계 기능이 추가되었습니다.',
		date: '2025-08-25',
		priority: 'medium',
	},
	{
		id: '3',
		title: '공지사항 업데이트 완료',
		content: '공지사항 업데이트가 성공적으로 적용되었습니다.',
		date: '2025-08-24',
		priority: 'low',
	},
];

export const useNoticeStore = create<NoticeStore>((set) => ({
	notices: mockNotices,
	addNotice: (noticeData) =>
		set((state) => ({
			notices: [
				{
					...noticeData,
					id: Date.now().toString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				...state.notices,
			],
		})),
	removeNotice: (id) =>
		set((state) => ({
			notices: state.notices.filter((notice) => notice.id !== id),
		})),
	updateNotice: (id, updatedNotice) =>
		set((state) => ({
			notices: state.notices.map((notice) =>
				notice.id === id
					? { ...notice, ...updatedNotice, updatedAt: new Date().toISOString() }
					: notice,
			),
		})),
}));
