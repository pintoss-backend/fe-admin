import { create } from 'zustand';
import type { Issuer, CreateIssuerData, UpdateIssuerData, CreateProductData, UpdateProductData } from '../model';

interface ProductStore {
	issuers: Issuer[];
	addIssuer: (issuer: CreateIssuerData) => void;
	updateIssuer: (id: number, data: UpdateIssuerData) => void;
	removeIssuer: (id: number) => void;
	addProduct: (issuerId: number, product: CreateProductData) => void;
	updateProduct: (issuerId: number, productId: number, data: UpdateProductData) => void;
	removeProduct: (issuerId: number, productId: number) => void;
}

// Mock data
const mockIssuers: Issuer[] = [
	{
		id: 1,
		name: '문화상품권',
		phoneNumber: '1588-1234',
		homepage: 'https://culture.go.kr',
		imageUrl: 'https://bucket-pintoss.s3.ap-northeast-2.amazonaws.com/voucher-issuer-thumnail-image/%E1%84%86%E1%85%AE%E1%86%AB%E1%84%92%E1%85%AA%E1%84%89%E1%85%A1%E1%86%BC%E1%84%91%E1%85%AE%E1%86%B7%E1%84%80%E1%85%AF%E1%86%AB.png',
		paymentMethods: [
			{ paymentMethod: '신용카드', discountRate: 5 },
			{ paymentMethod: '계좌이체', discountRate: 3 }
		],
		products: [
			{
				id: 1,
				name: '문화상품권 5,000원',
				price: 5000,
				createdAt: '2024-01-15',
				stockStatus: 'limited',
				stockQuantity: 500
			},
			{
				id: 2,
				name: '문화상품권 10,000원',
				price: 10000,
				createdAt: '2024-01-15',
				stockStatus: 'limited',
				stockQuantity: 300
			},
			{
				id: 3,
				name: '문화상품권 30,000원',
				price: 30000,
				createdAt: '2024-01-15',
				stockStatus: 'limited',
				stockQuantity: 200
			}
		]
	},
	{
		id: 2,
		name: '구글 플레이',
		phoneNumber: '1588-5678',
		homepage: 'https://play.google.com',
		imageUrl: 'https://bucket-pintoss.s3.ap-northeast-2.amazonaws.com/voucher-issuer-thumnail-image/%E1%84%80%E1%85%AE%E1%84%80%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8F%E1%85%A1%E1%84%83%E1%85%B3.png',
		paymentMethods: [
			{ paymentMethod: '신용카드', discountRate: 10 },
			{ paymentMethod: '계좌이체', discountRate: 8 }
		],
		products: [
			{
				id: 4,
				name: '구글 플레이 기프트카드 5,000원',
				price: 5000,
				createdAt: '2024-01-20',
				stockStatus: 'limited',
				stockQuantity: 400
			},
			{
				id: 5,
				name: '구글 플레이 기프트카드 10,000원',
				price: 10000,
				createdAt: '2024-01-20',
				stockStatus: 'limited',
				stockQuantity: 250
			},
			{
				id: 6,
				name: '구글 플레이 기프트카드 50,000원',
				price: 50000,
				createdAt: '2024-01-20',
				stockStatus: 'limited',
				stockQuantity: 100
			}
		]
	},
	{
		id: 3,
		name: '스타벅스',
		phoneNumber: '1522-3232',
		homepage: 'https://www.starbucks.co.kr',
		imageUrl: '', // 이미지 없음 - 기본 아이콘 표시
		paymentMethods: [
			{ paymentMethod: '신용카드', discountRate: 3 },
			{ paymentMethod: '계좌이체', discountRate: 2 }
		],
		products: [
			{
				id: 7,
				name: '스타벅스 기프트카드 10,000원',
				price: 10000,
				createdAt: '2024-01-25',
				stockStatus: 'limited',
				stockQuantity: 150
			},
			{
				id: 8,
				name: '스타벅스 기프트카드 20,000원',
				price: 20000,
				createdAt: '2024-01-25',
				stockStatus: 'limited',
				stockQuantity: 100
			},
			{
				id: 9,
				name: '스타벅스 기프트카드 50,000원',
				price: 50000,
				createdAt: '2024-01-25',
				stockStatus: 'limited',
				stockQuantity: 50
			}
		]
	}
];

export const useProductStore = create<ProductStore>((set) => ({
	issuers: mockIssuers,
	addIssuer: (issuerData: CreateIssuerData) =>
		set((state) => ({
			issuers: [
				...state.issuers,
				{
					...issuerData,
					id: Date.now(), // 자동 ID 부여
					products: []
				}
			],
		})),
	updateIssuer: (id: number, data: UpdateIssuerData) =>
		set((state) => ({
			issuers: state.issuers.map((issuer) =>
				issuer.id === id ? { ...issuer, ...data } : issuer,
			),
		})),
	removeIssuer: (id: number) =>
		set((state) => ({
			issuers: state.issuers.filter((issuer) => issuer.id !== id),
		})),
	addProduct: (issuerId: number, productData: CreateProductData) =>
		set((state) => ({
			issuers: state.issuers.map((issuer) =>
				issuer.id === issuerId
					? {
						...issuer,
						products: [
							...issuer.products,
							{
								...productData,
								id: Date.now(), // 자동 ID 부여
								createdAt: new Date().toISOString().split('T')[0],
							},
						],
					}
					: issuer,
			),
		})),
	updateProduct: (issuerId: number, productId: number, data: UpdateProductData) =>
		set((state) => ({
			issuers: state.issuers.map((issuer) =>
				issuer.id === issuerId
					? {
						...issuer,
						products: issuer.products.map((product) =>
							product.id === productId ? { ...product, ...data } : product,
						),
					}
					: issuer,
			),
		})),
	removeProduct: (issuerId: number, productId: number) =>
		set((state) => ({
			issuers: state.issuers.map((issuer) =>
				issuer.id === issuerId
					? {
						...issuer,
						products: issuer.products.filter((product) => product.id !== productId),
					}
					: issuer,
			),
		})),
}));
