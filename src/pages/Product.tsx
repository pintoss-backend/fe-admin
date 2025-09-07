import React from 'react';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { ProductList } from '@/features/product/ui/ProductList';
import { useNavigate } from 'react-router-dom';
import type { Product as ProductType } from '@/entities/product/model/product';

export const Product = () => {
	const navigate = useNavigate();

	const handleAddProduct = () => {
		navigate('/product/create');
	};

	const handleEditProduct = (product: ProductType) => {
		navigate(`/product/edit/${product.id}`);
	};

	return (
		<AppLayout title="상품 관리" mobileTitle="상품">
			<ProductList onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} />
		</AppLayout>
	);
};
