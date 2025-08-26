export interface Notice {
	id: string;
	title: string;
	content: string;
	date: string;
	priority: 'high' | 'medium' | 'low';
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateNoticeData {
	title: string;
	content: string;
	priority: 'high' | 'medium' | 'low';
	date: string;
}
