import { Typography, Card, Table, Tag, Button, Space, Popconfirm, message, Empty } from 'antd';
import {
	DeleteOutlined,
	PlusOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useProductStore } from '@/entities/product/store/productStore';
import type { Product } from '@/entities/product/model/product';
import * as styles from './ProductList.css';

const { Text } = Typography;

interface ProductListProps {
	onAddProduct?: () => void;
	onEditProduct?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddProduct, onEditProduct }) => {
	const { products, removeProduct } = useProductStore();

	const handleDelete = (id: string) => {
		try {
			removeProduct(id);
			message.success('상품이 성공적으로 삭제되었습니다.');
		} catch (error) {
			console.error('상품 삭제 실패:', error);
			message.error('상품 삭제에 실패했습니다.');
		}
	};

	const columns = [
		{
			title: '상품명',
			dataIndex: 'name',
			key: 'name',
			width: 200,
			align: 'center' as const,
		},
		{
			title: '카테고리',
			dataIndex: 'category',
			key: 'category',
			width: 100,
			align: 'center' as const,
			render: (category: string) => {
				const colorMap: { [key: string]: string } = {
					디지털: 'blue',
					게임: 'green',
					문화: 'purple',
					카페: 'orange',
					스트리밍: 'red',
					기타: 'default',
				};
				return (
					<Tag color={colorMap[category] || 'default'} className={styles.categoryTag}>
						{category}
					</Tag>
				);
			},
		},
		{
			title: '판매금액',
			dataIndex: 'salePrice',
			key: 'salePrice',
			width: 120,
			align: 'center' as const,
			render: (price: number) => `${price.toLocaleString()}원`,
		},
		{
			title: '할인률',
			dataIndex: 'discountRate',
			key: 'discountRate',
			width: 100,
			align: 'center' as const,
			render: (rate: number) => (rate > 0 ? `${rate}%` : '-'),
		},
		{
			title: '최종판매금액',
			dataIndex: 'finalPrice',
			key: 'finalPrice',
			width: 120,
			align: 'center' as const,
			render: (price: number) => `${price.toLocaleString()}원`,
		},
		{
			title: '재고현황',
			dataIndex: 'stockStatus',
			key: 'stockStatus',
			width: 120,
			align: 'center' as const,
			render: (status: string, record: Product) => {
				if (status === 'unlimited') return '무제한';
				return `${record.stockQuantity}개`;
			},
		},
		{
			title: '신용카드',
			key: 'creditCard',
			width: 100,
			align: 'center' as const,
			render: (record: Product) => {
				const gateway = record.paymentGateway.creditCard;
				return gateway === 'galaxia' ? '갤럭시아' : '다날';
			},
		},
		{
			title: '휴대폰',
			key: 'mobile',
			width: 100,
			align: 'center' as const,
			render: (record: Product) => {
				const gateway = record.paymentGateway.mobile;
				return gateway === 'galaxia' ? '갤럭시아' : '다날';
			},
		},
		{
			title: '발행업체',
			dataIndex: 'issuer',
			key: 'issuer',
			width: 120,
			align: 'center' as const,
		},
		{
			title: '',
			key: 'actions',
			width: 120,
			fixed: 'right' as const,
			align: 'center' as const,
			render: (record: Product) => (
				<Space>
					{onEditProduct && (
						<Button
							type="text"
							icon={<EditOutlined />}
							size="small"
							onClick={() => onEditProduct(record)}
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
						onConfirm={() => handleDelete(record.id)}
						okText="삭제"
						cancelText="취소"
						okButtonProps={{
							danger: true,
							style: {
								background: '#ff4d4f',
								borderColor: '#ff4d4f',
								fontWeight: 500,
							},
						}}
						cancelButtonProps={{
							style: {
								borderColor: '#d9d9d9',
								color: '#666',
								fontWeight: 500,
							},
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
				</Space>
			),
		},
	];

	const extraButton = onAddProduct ? (
		<Button type="primary" icon={<PlusOutlined />} onClick={onAddProduct}>
			상품 등록
		</Button>
	) : null;

	return (
		<div className={styles.productListCard}>
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						상품 목록
						<Tag color="default" style={{ margin: 0 }}>
							총 {products.length}건
						</Tag>
					</div>
				}
				extra={extraButton}
			>
				{products.length === 0 ? (
					<Empty
						description="등록된 상품이 없습니다."
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ padding: '40px 0' }}
					/>
				) : (
					<Table
						columns={columns}
						dataSource={products}
						rowKey="id"
						scroll={{ x: 1200 }}
						pagination={false}
					/>
				)}
			</Card>
		</div>
	);
};
