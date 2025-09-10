import { Typography, Card, Table, Tag, Button, Space, Popconfirm, message, Empty, Image } from 'antd';
import {
	DeleteOutlined,
	PlusOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	DownOutlined,
	RightOutlined,
	HomeOutlined,
	PhoneOutlined,
	PictureOutlined,
} from '@ant-design/icons';
import { useProductStore } from '@/entities/product/store/productStore';
import type { Product } from '@/entities/product/model/product';
import * as styles from './ProductList.css';
import { useMemo, useState, useCallback } from 'react';

const { Text } = Typography;

interface ProductListProps {
	onAddIssuer?: () => void;
	onAddProduct?: () => void;
	onEditProduct?: (product: Product) => void;
	onEditIssuer?: (issuer: any) => void;
}

interface TreeDataNode {
	key: string;
	// 발행사 정보
	issuerId?: number;
	issuerName?: string;
	phoneNumber?: string;
	homepage?: string;
	imageUrl?: string;
	paymentMethods?: Array<{ paymentMethod: string; discountRate: number }>;
	// 상품권 정보
	productId?: number;
	productName?: string;
	price?: number;
	// 공통 정보
	name: string;
	stockStatus?: string;
	stockQuantity?: number;
	createdAt?: string;
	// 트리 구조
	children?: TreeDataNode[];
	isParent?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddIssuer, onAddProduct, onEditProduct, onEditIssuer }) => {
	const { issuers, removeProduct } = useProductStore();
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

	const handleDelete = useCallback((key: string) => {
		try {
			// key에서 issuerId와 productId 추출
			const [type, id] = key.split('-');
			if (type === 'product') {
				// 상품 삭제를 위해 발행사 ID 찾기
				const issuer = issuers.find(issuer => 
					issuer.products.some(product => product.id === parseInt(id))
				);
				if (issuer) {
					removeProduct(issuer.id, parseInt(id));
					message.success('상품이 성공적으로 삭제되었습니다.');
				}
			}
		} catch (error) {
			console.error('상품 삭제 실패:', error);
			message.error('상품 삭제에 실패했습니다.');
		}
	}, [issuers, removeProduct]);

	const handleExpand = useCallback((record: TreeDataNode) => {
		setExpandedRowKeys(prev => 
			prev.includes(record.key)
				? prev.filter(key => key !== record.key)
				: [...prev, record.key]
		);
	}, []);

	const handleHomepageClick = useCallback((url: string) => {
		window.open(url, '_blank');
	}, []);

	// 발행사와 상품권을 트리 데이터로 변환
	const treeData = useMemo(() => {
		if (!issuers || issuers.length === 0) {
			return [];
		}

		const treeNodes: TreeDataNode[] = issuers.map(issuer => {
			// 상품권들을 자식 노드로 변환
			const children: TreeDataNode[] = issuer.products.map(product => ({
				key: `product-${product.id}`,
				productId: product.id,
				productName: product.name,
				price: product.price,
				name: product.name,
				stockStatus: product.stockStatus,
				stockQuantity: product.stockQuantity,
				createdAt: product.createdAt,
				isParent: false,
			}));

			// 발행사 노드 생성
			return {
				key: `issuer-${issuer.id}`,
				issuerId: issuer.id,
				issuerName: issuer.name,
				phoneNumber: issuer.phoneNumber,
				homepage: issuer.homepage,
				imageUrl: issuer.imageUrl,
				paymentMethods: issuer.paymentMethods,
				name: issuer.name,
				isParent: true,
				children: children,
			};
		});

		return treeNodes;
	}, [issuers]);

	// 통합 컬럼 정의 (발행사/상품 행 모두 처리)
	const columns = useMemo(() => [
		{
			title: '',
			key: 'expand',
			width: 40,
			align: 'center' as const,
			render: (record: TreeDataNode) => {
				if (!record || !record.isParent) return null;
				const isExpanded = expandedRowKeys.includes(record.key);
				return (
					<Button
						type="text"
						size="small"
						icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
						className={styles.expandButton}
						onClick={(e) => {
							e.stopPropagation();
							handleExpand(record);
						}}
					/>
				);
			},
		},
		{
			title: '발행사/상품명',
			dataIndex: 'name',
			key: 'name',
			width: 180,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return null;
				if (record.isParent) {
					return (
						<div className={styles.issuerInfoContainer}>
							{record.imageUrl ? (
								<Image
									src={record.imageUrl}
									alt={record.issuerName}
									width={32}
									height={32}
									style={{ borderRadius: '4px', objectFit: 'cover' }}
									preview={false}
								/>
							) : (
								<div className={styles.imageContainer}>
									<PictureOutlined style={{ color: '#999', fontSize: '16px' }} />
								</div>
							)}
							<Text strong style={{ color: '#1890ff' }}>{record.issuerName}</Text>
						</div>
					);
				} else {
					return (
						<div className={styles.productInfoContainer}>
							<Text>{record.productName}</Text>
						</div>
					);
				}
			},
		},
		{
			title: '할인률',
			dataIndex: 'discountRate',
			key: 'discountRate',
			width: 100,
			align: 'center' as const,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return '-';
				if (record.isParent) {
					// 발행사 행에서는 결제 수단별 할인률 표시
					if (!record.paymentMethods || record.paymentMethods.length === 0) return '-';
					return (
						<div className={styles.discountRateContainer}>
							{record.paymentMethods.map((pm, index) => (
								<Text key={index} className={styles.discountRateText}>
									{pm.paymentMethod}: {pm.discountRate}%
								</Text>
							))}
						</div>
					);
				} else {
					// 상품 행에서는 발행사의 결제 수단별 할인률 표시
					const parentRecord = treeData.find(item => item.isParent && item.children?.some(child => child.key === record.key));
					if (parentRecord && parentRecord.paymentMethods) {
						return (
							<div className={styles.discountRateContainer}>
								{parentRecord.paymentMethods.map((pm, index) => (
									<Text key={index} className={styles.discountRateTextChild}>
										{pm.paymentMethod}: {pm.discountRate}%
									</Text>
								))}
							</div>
						);
					}
					return '-';
				}
			},
		},
		{
			title: '상품권 설명',
			dataIndex: 'productInfo',
			key: 'productInfo',
			width: 250,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return '-';
				if (record.isParent) {
					// 발행사 설명을 표시 (임시로 발행사명 사용)
					return (
						<Text className={styles.productDescriptionText}>
							{record.issuerName}에서 제공하는 상품권입니다.
						</Text>
					);
				} else {
					return '-';
				}
			},
		},
		{
			title: '가격',
			dataIndex: 'salePrice',
			key: 'salePrice',
			width: 120,
			align: 'center' as const,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return '-';
				if (record.isParent) {
					return '-';
				} else {
					return (
						<div className={styles.priceText}>
							{(record.price || 0).toLocaleString()}원
						</div>
					);
				}
			},
		},
		{
			title: '재고 개수',
			dataIndex: 'stockQuantity',
			key: 'stockQuantity',
			width: 100,
			align: 'center' as const,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return '-';
				if (record.isParent) {
					return '-';
				} else {
					if (record.stockStatus === 'unlimited') {
						return <Tag color="green">무제한</Tag>;
					}
					const isLowStock = (record.stockQuantity || 0) < 50;
					return (
						<Tag color={isLowStock ? 'red' : 'blue'}>
							{record.stockQuantity}개
						</Tag>
					);
				}
			},
		},
		{
			title: '',
			key: 'contact',
			width: 80,
			align: 'center' as const,
			render: (_: any, record: TreeDataNode) => {
				if (!record) return null;
				if (record.isParent) {
					return (
						<div className={styles.contactContainer}>
							{record.phoneNumber && (
								<Button
									type="text"
									icon={<PhoneOutlined />}
									size="small"
									style={{ color: '#52c41a' }}
									title={`고객센터: ${record.phoneNumber}`}
								/>
							)}
							{record.homepage && (
								<Button
									type="text"
									icon={<HomeOutlined />}
									size="small"
									style={{ color: '#1890ff' }}
									title={record.homepage}
									onClick={() => handleHomepageClick(record.homepage!)}
								/>
							)}
						</div>
					);
				}
				return null;
			},
		},
		{
			title: '',
			key: 'actions',
			width: 100,
			fixed: 'right' as const,
			align: 'center' as const,
			render: (record: TreeDataNode) => {
				if (!record) return null;
				return (
					<Space>
						{record.isParent ? (
							// 발행사 행 액션
							<>
								<Button
									type="text"
									icon={<EditOutlined />}
									size="small"
									onClick={() => {
										if (onEditIssuer) {
											// 전체 발행사 정보를 찾아서 전달
											const fullIssuerData = issuers.find(issuer => issuer.id === record.issuerId);
											console.log('찾은 발행사 데이터:', fullIssuerData); // 디버깅용
											if (fullIssuerData) {
												onEditIssuer(fullIssuerData);
											}
										}
									}}
								/>
								<Popconfirm
									title={
										<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
											<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
											<span style={{ fontWeight: 600 }}>발행사 삭제</span>
										</div>
									}
									description={
										<div style={{ marginLeft: '24px', color: '#666' }}>
											발행사와 모든 상품을 삭제하시겠습니까?
										</div>
									}
							onConfirm={() => {
								// 발행사 삭제 로직 (추후 구현)
								console.log('발행사 삭제:', record.issuerName);
							}}
									okText="삭제"
									cancelText="취소"
									okButtonProps={{
										danger: true,
										className: styles.popconfirmButton,
									}}
									cancelButtonProps={{
										className: styles.cancelButton,
									}}
									placement="topRight"
									overlayStyle={{
										borderRadius: '8px',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
									}}
									icon={null}
								>
									<Button type="text" icon={<DeleteOutlined />} danger size="small" />
								</Popconfirm>
							</>
						) : (
							// 상품 행 액션
							<>
								{onEditProduct && (
									<Button
										type="text"
										icon={<EditOutlined />}
										size="small"
										onClick={() => {
											// 전체 상품 정보를 찾아서 전달
											const fullProductData = issuers
												.flatMap(issuer => issuer.products)
												.find(product => product.id === record.productId);
											console.log('찾은 상품 데이터:', fullProductData); // 디버깅용
											if (fullProductData) {
												onEditProduct(fullProductData);
											}
										}}
									/>
								)}
								<Popconfirm
									title={
										<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
											<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
											<span style={{ fontWeight: 600 }}>상품 삭제</span>
										</div>
									}
									description={
										<div style={{ marginLeft: '24px', color: '#666' }}>상품을 삭제하시겠습니까?</div>
									}
									onConfirm={() => handleDelete(record.key)}
									okText="삭제"
									cancelText="취소"
									okButtonProps={{
										danger: true,
										className: styles.popconfirmButton,
									}}
									cancelButtonProps={{
										className: styles.cancelButton,
									}}
									placement="topRight"
									overlayStyle={{
										borderRadius: '8px',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
									}}
									icon={null}
								>
									<Button type="text" icon={<DeleteOutlined />} danger size="small" />
								</Popconfirm>
							</>
						)}
					</Space>
				);
			},
		},
	], [expandedRowKeys, treeData, onEditProduct, handleDelete, handleExpand, handleHomepageClick]);

	const extraButtons = (
		<Space>
			{onAddIssuer && (
				<Button type="primary" icon={<PlusOutlined />} onClick={onAddIssuer}>
					발행사 등록
				</Button>
			)}
			{onAddProduct && (
				<Button icon={<PlusOutlined />} onClick={onAddProduct}>
					상품권 등록
				</Button>
			)}
		</Space>
	);

	return (
		<div className={styles.productListCard}>
			<Card
				title="상품 목록"
				extra={extraButtons}
			>
				{treeData.length === 0 ? (
					<Empty
						description="등록된 상품이 없습니다."
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ padding: '40px 0' }}
					/>
				) : (
					<Table
						columns={columns}
						dataSource={treeData}
						rowKey="key"
						scroll={{ x: 1000 }}
						pagination={false}
						expandable={{
							expandRowByClick: false,
							expandIcon: () => null, // 기본 아이콘 숨김
							indentSize: 0, // 들여쓰기 제거
							expandedRowKeys: expandedRowKeys,
							onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
						}}
						rowClassName={(record) => {
							if (record.isParent) {
								return styles.parentRow;
							}
							return styles.childRow;
						}}
						size="middle"
					/>
				)}
			</Card>
		</div>
	);
};
