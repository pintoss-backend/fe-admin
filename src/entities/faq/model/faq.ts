export interface Faq {
	id: string;
	category: string;
	question: string;
	answer: string;
	isPublished: boolean;
	order?: number;
	tags?: string[];
	updatedAt: string;
}

export interface FaqCreateInput {
	category: string;
	question: string;
	answer: string;
	isPublished: boolean;
	order?: number;
	tags?: string[];
}
