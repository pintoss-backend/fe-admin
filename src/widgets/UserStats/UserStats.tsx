import { Card, Row, Col, Statistic } from 'antd';

export const UserStats: React.FC<{
	total: number;
	blocked: number;
	withdrawn: number;
}> = ({ total, blocked, withdrawn }) => {
	return (
		<Card>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Statistic title="총 회원수" value={total} suffix="명" />
				</Col>
				<Col xs={24} md={8}>
					<Statistic title="차단 회원수" value={blocked} suffix="명" />
				</Col>
				<Col xs={24} md={8}>
					<Statistic title="탈퇴 회원수" value={withdrawn} suffix="명" />
				</Col>
			</Row>
		</Card>
	);
};
