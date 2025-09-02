import type { Faq } from '@/entities/faq/model';

const seedFaqs: Faq[] = [
	{
		id: 'faq-join-001',
		category: '가입/로그인',
		question: '회원가입은 어떻게 하나요?',
		answer:
			'우측 상단의 회원가입 버튼을 눌러 휴대폰 인증 후 기본 정보를 입력해주세요. 이메일 인증을 완료해야 로그인이 가능합니다.',
		updatedAt: '2025-08-20T09:10:00Z',
	},
	{
		id: 'faq-login-002',
		category: '가입/로그인',
		question: '비밀번호를 잊어버렸어요. 어떻게 하나요?',
		answer:
			'로그인 화면의 “비밀번호 찾기”를 통해 재설정 메일을 보내드립니다. 메일이 오지 않으면 스팸함을 확인해 주세요.',
		updatedAt: '2025-08-27T12:00:00Z',
	},
	{
		id: 'faq-payment-003',
		category: '결제',
		question: '결제 수단은 무엇을 지원하나요?',
		answer:
			'국내 신용/체크카드, 실시간 계좌이체, 간편결제(카카오페이/네이버페이)를 지원합니다. 일부 법인카드는 제한될 수 있습니다.',
		updatedAt: '2025-08-29T02:30:00Z',
	},
	{
		id: 'faq-account-004',
		category: '계정',
		question: '회원정보를 수정하고 싶어요.',
		answer:
			'마이페이지 > 프로필 설정에서 이름, 연락처, 알림 설정 등을 변경할 수 있습니다. 이름/닉네임은 정책에 따라 보관됩니다.',
		updatedAt: '2025-08-15T05:21:00Z',
	},
	{
		id: 'faq-service-005',
		category: '서비스',
		question: '서비스 점검은 언제 진행되나요?',
		answer:
			'정기 점검은 매월 첫째 주 수요일 새벽 2시~5시에 진행됩니다. 공지사항을 통해 사전 안내해드립니다.',
		updatedAt: '2025-07-30T23:59:00Z',
	},
];

export async function getFaqsMock(): Promise<Faq[]> {
	// const { data } = await api.get<Faq[]>('/faqs');
	// return data;
	return Promise.resolve(seedFaqs);
}
