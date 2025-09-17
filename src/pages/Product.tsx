import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { ProductList } from '@/features/product/ui/ProductList';
import { ProductForm } from '@/features/product/ui/ProductForm';
import { useProductStore } from '@/entities/product/store/productStore';
import { message } from 'antd';
import type { Product as ProductType, CreateProductData } from '@/entities/product/model/product';

export const Product = () => {
	const navigate = useNavigate();
	const [productModalVisible, setProductModalVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
	const { addProduct } = useProductStore();

	const handleAddIssuer = () => {
		navigate('/issuer/create');
	};

	const handleEditIssuer = (issuer: any) => {
		navigate(`/issuer/edit/${issuer.id}`);
	};

	const handleAddProduct = () => {
		setEditingProduct(null);
		setProductModalVisible(true);
	};

	const handleEditProduct = (product: ProductType) => {
		setEditingProduct(product);
		setProductModalVisible(true);
	};

	const handleProductSubmit = (data: CreateProductData & { issuerId: number }) => {
		try {
			const { issuerId, ...productData } = data;
			if (editingProduct) {
				// 편집 모드
				message.success('상품권이 성공적으로 수정되었습니다.');
			} else {
				// 등록 모드
				addProduct(issuerId, productData);
				message.success('상품권이 성공적으로 등록되었습니다.');
			}
			setProductModalVisible(false);
			setEditingProduct(null);
		} catch (error) {
			console.error('상품권 처리 실패:', error);
			message.error('상품권 처리에 실패했습니다.');
		}
	};

	return (
		<AppLayout title="상품 관리" mobileTitle="상품">
			<ProductList
				onAddIssuer={handleAddIssuer}
				onAddProduct={handleAddProduct}
				onEditProduct={handleEditProduct}
				onEditIssuer={handleEditIssuer}
			/>

			<ProductForm
				visible={productModalVisible}
				onSubmit={handleProductSubmit}
				onCancel={() => {
					setProductModalVisible(false);
					setEditingProduct(null);
				}}
				initialData={editingProduct}
			/>
		</AppLayout>
	);
};
