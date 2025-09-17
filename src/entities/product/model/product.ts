// 결제 수단 정보
export interface PaymentMethod {
	paymentMethod: string; // "결제수단A", "결제수단B"
	discountRate: number; // "할인율A", "할인율B"
}

// 발행사 정보
export interface Issuer {
	id: number;
	name: string; // "상품권 발행사 이름"
	description: string; // "발행사 설명"
	fee: number; // "수수료"
	notice: string; // "유의사항"
	productInfo: string; // "상품정보"
	phoneNumber: string; // "발행 업체 전화번호"
	homepage: string; // "발행 업체 url 주소"
	imageUrl?: string; // "발행사 이미지"
	descriptionImageUrl?: string; // "상품설명이미지 URL"
	paymentMethods: PaymentMethod[]; // "결제 수단" 배열
	products: Product[]; // "상품정보" 배열
}

// 상품권 정보 (상품정보)
export interface Product {
	id: number;
	name: string;
	price: number;
	createdAt: string;
}

// 발행사 생성 데이터
export interface CreateIssuerData {
	name: string;
	description: string;
	fee: number;
	notice: string;
	productInfo: string;
	phoneNumber: string;
	homepage: string;
	imageUrl?: string;
	descriptionImageUrl?: string;
	paymentMethods: PaymentMethod[];
}

// 발행사 수정 데이터
export interface UpdateIssuerData extends Partial<CreateIssuerData> {
	id: number;
}

// 상품권 생성 데이터
export interface CreateProductData {
	name: string;
	price: number;
}

// 상품권 수정 데이터
export interface UpdateProductData extends Partial<CreateProductData> {
	id: number;
}
