import { useState } from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
	const [count, setCount] = useState(0);
	const { Title, Text } = Typography;

	return (
		<div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				<div style={{ textAlign: 'center' }}>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>

				<Card>
					<Title level={2} style={{ textAlign: 'center' }}>
						Vite + React + Ant Design
					</Title>

					<div style={{ textAlign: 'center', marginBottom: '24px' }}>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							size="large"
							onClick={() => setCount((count) => count + 1)}
						>
							Count is {count}
						</Button>
					</div>

					<Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
						Edit <code>src/App.tsx</code> and save to test HMR
					</Text>
				</Card>

				<Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
					Click on the React logo to learn more
				</Text>
			</Space>
		</div>
	);
}

export default App;
