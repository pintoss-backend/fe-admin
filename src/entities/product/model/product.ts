export interface Product {
	id: string;
	category: string;
	name: string;
	imageUrl: string;
	salePrice: number;
	discountRate: number;
	finalPrice: number;
	stockStatus: 'unlimited' | 'limited';
	stockQuantity?: number;
	paymentGateway: {
		creditCard: 'galaxia' | 'danal';
		mobile: 'galaxia' | 'danal';
	};
	issuer: string;
	homepage: string;
	customerCenter: string;
	productInfo: string;
	notes: string;
	descriptionImageUrl?: string;
	status: 'active' | 'inactive' | 'expired';
	createdAt: string;
	expiresAt: string;
}

export interface CreateProductData {
	category: string;
	name: string;
	imageUrl: string;
	salePrice: number;
	discountRate: number;
	finalPrice: number;
	stockStatus: 'unlimited' | 'limited';
	stockQuantity?: number;
	paymentGateway: {
		creditCard: 'galaxia' | 'danal';
		mobile: 'galaxia' | 'danal';
	};
	issuer: string;
	homepage: string;
	customerCenter: string;
	productInfo: string;
	notes: string;
	descriptionImageUrl?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
	id: string;
}
