import { create } from 'zustand';
import type { Product, CreateProductData, UpdateProductData } from '../model';

interface ProductStore {
	products: Product[];
	addProduct: (product: CreateProductData) => void;
	updateProduct: (id: string, data: UpdateProductData) => void;
	removeProduct: (id: string) => void;
	updateProductOrder: (products: Product[]) => void;
}

// Mock data
const mockProducts: Product[] = [
	{
		id: 'GC001',
		category: '디지털',
		name: '구글플레이 기프트카드',
		imageUrl: '/images/google-play.jpg',
		salePrice: 50000,
		discountRate: 0,
		finalPrice: 50000,
		stockStatus: 'limited',
		stockQuantity: 100,
		paymentGateway: {
			creditCard: 'galaxia',
			mobile: 'galaxia',
		},
		issuer: '구글',
		homepage: 'https://play.google.com',
		customerCenter: '1588-1234',
		productInfo: '구글플레이에서 앱, 게임, 영화, 음악 등을 구매할 수 있는 기프트카드입니다.',
		notes: '구글 계정에 등록 후 사용 가능합니다.',
		descriptionImageUrl: '/images/google-play-desc.jpg',
		status: 'active',
		createdAt: '2024-01-15',
		expiresAt: '2024-12-31',
	},
	{
		id: 'TC002',
		category: '게임',
		name: '틴캐시',
		imageUrl: '/images/teen-cash.jpg',
		salePrice: 10000,
		discountRate: 5,
		finalPrice: 9500,
		stockStatus: 'limited',
		stockQuantity: 200,
		paymentGateway: {
			creditCard: 'danal',
			mobile: 'danal',
		},
		issuer: '넥슨',
		homepage: 'https://nexon.com',
		customerCenter: '1588-1234',
		productInfo: '게임 내 아이템 구매 및 충전에 사용할 수 있는 틴캐시입니다.',
		notes: '게임 계정에 등록 후 사용해야 합니다.',
		descriptionImageUrl: '/images/teen-cash-desc.jpg',
		status: 'active',
		createdAt: '2024-01-10',
		expiresAt: '2024-06-30',
	},
	{
		id: 'CC003',
		category: '문화',
		name: '문화상품권',
		imageUrl: '/images/culture-voucher.jpg',
		salePrice: 30000,
		discountRate: 0,
		finalPrice: 30000,
		stockStatus: 'limited',
		stockQuantity: 0,
		paymentGateway: {
			creditCard: 'galaxia',
			mobile: 'galaxia',
		},
		issuer: '문화체육관광부',
		homepage: 'https://culture.go.kr',
		customerCenter: '1588-1234',
		productInfo: '영화관, 서점, 공연장 등에서 사용할 수 있는 문화상품권입니다.',
		notes: '2023년 연말 이벤트용입니다.',
		descriptionImageUrl: '/images/culture-voucher-desc.jpg',
		status: 'expired',
		createdAt: '2023-12-01',
		expiresAt: '2023-12-31',
	},
	{
		id: 'SB004',
		category: '카페',
		name: '스타벅스 기프트카드',
		imageUrl: '/images/starbucks.jpg',
		salePrice: 25000,
		discountRate: 10,
		finalPrice: 22500,
		stockStatus: 'limited',
		stockQuantity: 150,
		paymentGateway: {
			creditCard: 'galaxia',
			mobile: 'galaxia',
		},
		issuer: '스타벅스',
		homepage: 'https://starbucks.co.kr',
		customerCenter: '1588-1234',
		productInfo: '스타벅스 매장에서 음료와 상품을 구매할 수 있는 기프트카드입니다.',
		notes: '전국 스타벅스 매장에서 사용 가능합니다.',
		descriptionImageUrl: '/images/starbucks-desc.jpg',
		status: 'active',
		createdAt: '2024-01-20',
		expiresAt: '2024-12-31',
	},
];

export const useProductStore = create<ProductStore>((set) => ({
	products: mockProducts,
	addProduct: (productData: CreateProductData) =>
		set((state) => ({
			products: [
				...state.products,
				{
					...productData,
					id: `GC${Date.now().toString().slice(-6)}`,
					status: 'active',
					createdAt: new Date().toISOString().split('T')[0],
					expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
				},
			],
		})),
	updateProduct: (id: string, data: UpdateProductData) =>
		set((state) => ({
			products: state.products.map((product) =>
				product.id === id ? { ...product, ...data } : product,
			),
		})),
	removeProduct: (id: string) =>
		set((state) => ({
			products: state.products.filter((product) => product.id !== id),
		})),
	updateProductOrder: (products: Product[]) =>
		set(() => ({
			products,
		})),
}));
