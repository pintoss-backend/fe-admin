// 문의내역 API contract 예시
import type { Inquiry } from '@/entities/inquiries';

// 목록 조회 응답 타입
export interface GetInquiriesResponse {
	inquiries: Inquiry[];
	totalCount: number;
}

// 단일 문의 조회 응답 타입
export interface GetInquiryResponse {
	inquiry: Inquiry;
}

// 문의 등록 요청 타입
export interface CreateInquiryRequest {
	title: string;
	content: string;
}

// 문의 등록 응답 타입
export interface CreateInquiryResponse {
	inquiry: Inquiry;
}
