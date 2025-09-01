import { Row, Col, Card, Statistic, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export const UserStats: React.FC<{
	total: number;
	blocked: number;
	withdrawn: number;
	onResetList?: () => void;
}> = ({ total, blocked, withdrawn, onResetList }) => {
	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title="총 회원수" value={total} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title="차단 명수" value={blocked} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title="탈퇴 명수" value={withdrawn} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Space>
						<Button
							icon={<ReloadOutlined />}
							onClick={() => {
								onResetList?.();
							}}
						>
							전체 목록
						</Button>
					</Space>
				</Card>
			</Col>
		</Row>
	);
};
