import { useState } from 'react';
import { AppLayout } from '@/shared/ui/Layout/Layout';
import { ProductList } from '@/features/product/ui/ProductList';
import { IssuerForm } from '@/features/product/ui/IssuerForm';
import { ProductForm } from '@/features/product/ui/ProductForm';
import { useProductStore } from '@/entities/product/store/productStore';
import { message } from 'antd';
import type { Product as ProductType, CreateIssuerData, CreateProductData } from '@/entities/product/model/product';

export const Product = () => {
	const [issuerModalVisible, setIssuerModalVisible] = useState(false);
	const [productModalVisible, setProductModalVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
	const [editingIssuer, setEditingIssuer] = useState<any>(null);
	const { addIssuer, addProduct } = useProductStore();

	const handleAddIssuer = () => {
		setEditingIssuer(null);
		setIssuerModalVisible(true);
	};

	const handleEditIssuer = (issuer: any) => {
		setEditingIssuer(issuer);
		setIssuerModalVisible(true);
	};

	const handleAddProduct = () => {
		setEditingProduct(null);
		setProductModalVisible(true);
	};

	const handleEditProduct = (product: ProductType) => {
		setEditingProduct(product);
		setProductModalVisible(true);
	};

	const handleIssuerSubmit = (data: CreateIssuerData & { imageFile?: File }) => {
		try {
			if (editingIssuer) {
				// 편집 모드
				message.success('발행사가 성공적으로 수정되었습니다.');
			} else {
				// 등록 모드 - 실제 파일이 있는 경우 처리
				if (data.imageFile) {
					console.log('업로드된 파일:', data.imageFile);
					// TODO: 실제 파일 업로드 API 호출
					// const uploadedUrl = await uploadFile(data.imageFile);
					// data.imageUrl = uploadedUrl;
				}
				addIssuer(data);
				message.success('발행사가 성공적으로 등록되었습니다.');
			}
			setIssuerModalVisible(false);
			setEditingIssuer(null);
		} catch (error) {
			console.error('발행사 처리 실패:', error);
			message.error('발행사 처리에 실패했습니다.');
		}
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
			
			<IssuerForm
				visible={issuerModalVisible}
				onSubmit={handleIssuerSubmit}
				onCancel={() => {
					setIssuerModalVisible(false);
					setEditingIssuer(null);
				}}
				initialData={editingIssuer}
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
