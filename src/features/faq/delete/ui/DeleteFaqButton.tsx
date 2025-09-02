import React from 'react';
import { Button, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const DeleteFaqButton: React.FC<{
	onConfirm: () => void;
	size?: 'small' | 'middle' | 'large';
}> = ({ onConfirm, size = 'small' }) => (
	<Popconfirm
		title="삭제하시겠어요?"
		okText="삭제"
		cancelText="취소"
		okButtonProps={{ danger: true }}
		onConfirm={onConfirm}
	>
		<Tooltip title="삭제">
			<Button type="text" danger size={size} icon={<DeleteOutlined />} />
		</Tooltip>
	</Popconfirm>
);
