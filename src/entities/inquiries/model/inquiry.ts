// Inquiry 도메인 모델 타입 정의
export interface Inquiry {
	id: number;
	title: string;
	content: string;
	status: 'open' | 'closed';
	createdAt: string;
	updatedAt?: string;
}
