// 문의 내역 상태 관리 (간단한 useState 예시)
import { useState, useEffect } from 'react';
import type { Inquiry } from '@/entities/inquiries';
import { fetchInquiries } from '../api/fetchInquiries';

export function useInquiryList() {
	const [inquiryList, setInquiryList] = useState<Inquiry[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchInquiries().then((data) => {
			setInquiryList(data);
			setLoading(false);
		});
	}, []);

	return { inquiryList, loading };
}
