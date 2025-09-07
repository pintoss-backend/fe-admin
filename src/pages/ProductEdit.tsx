import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { ProductForm } from '@/features/product/ui/ProductForm';
import { useNavigate, useParams } from 'react-router-dom';
import type {
	Product,
	UpdateProductData,
	CreateProductData,
} from '@/entities/product/model/product';
import { useProductStore } from '@/entities/product/store/productStore';
import { message, Spin } from 'antd';

export const ProductEdit: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { products, updateProduct } = useProductStore();
	const [loading, setLoading] = useState(true);
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		if (id) {
			const foundProduct = products.find((p) => p.id === id);
			if (foundProduct) {
				setProduct(foundProduct);
			} else {
				message.error('상품을 찾을 수 없습니다.');
				navigate('/product');
			}
			setLoading(false);
		}
	}, [id, products, navigate]);

	const handleFormSubmit = (data: CreateProductData) => {
		if (!id) return;

		try {
			const updateData: UpdateProductData = { ...data, id };
			updateProduct(id, updateData);
			message.success('상품이 성공적으로 수정되었습니다.');
			navigate('/product');
		} catch (error) {
			console.error('상품 수정 실패:', error);
			message.error('상품 수정에 실패했습니다.');
		}
	};

	const handleFormCancel = () => {
		navigate('/product');
	};

	if (loading) {
		return (
			<AppLayout title="상품 수정" mobileTitle="상품수정">
				<div style={{ textAlign: 'center', padding: '50px' }}>
					<Spin size="large" />
				</div>
			</AppLayout>
		);
	}

	if (!product) {
		return null;
	}

	return (
		<AppLayout title="상품 수정" mobileTitle="상품수정">
			<ProductForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} initialData={product} />
		</AppLayout>
	);
};
