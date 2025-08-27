// 문의 내역 목록 조회 API 함수 (mock)
import type { Inquiry } from '@/entities/inquiries';

export async function fetchInquiries(): Promise<Inquiry[]> {
	// TODO : 실제 API 연동 시 axios/fetch 사용
	return [
		{
			id: 1,
			title: '로그인 오류 문의',
			content: '로그인 시 에러가 발생합니다.',
			status: 'open',
			createdAt: '2025-08-01',
		},
		{
			id: 2,
			title: '회원정보 수정 문의',
			content: '회원정보 수정이 안됩니다.',
			status: 'closed',
			createdAt: '2025-08-02',
		},
	];
}
