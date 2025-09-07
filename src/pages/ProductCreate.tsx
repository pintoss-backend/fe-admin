import React from 'react';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { ProductForm } from '@/features/product/ui/ProductForm';
import { useNavigate } from 'react-router-dom';
import type { CreateProductData } from '@/entities/product/model/product';
import { useProductStore } from '@/entities/product/store/productStore';
import { message } from 'antd';

export const ProductCreate: React.FC = () => {
	const navigate = useNavigate();
	const { addProduct } = useProductStore();

	const handleFormSubmit = (data: CreateProductData) => {
		try {
			addProduct(data);
			message.success('상품이 성공적으로 등록되었습니다.');
			navigate('/product');
		} catch (error) {
			console.error('상품 등록 실패:', error);
			message.error('상품 등록에 실패했습니다.');
		}
	};

	const handleFormCancel = () => {
		navigate('/product');
	};

	return (
		<AppLayout title="상품 등록" mobileTitle="상품등록">
			<ProductForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} initialData={null} />
		</AppLayout>
	);
};
