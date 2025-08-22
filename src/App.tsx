import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Dashboard } from '@/pages/Dashboard';
import { Notice } from '@/pages/notice';
import { useAuthStore } from '@/entities/auth/store/authStore';

function App() {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <LoginForm />;
	}

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/users" element={<Dashboard />} />
			<Route path="/payments" element={<Dashboard />} />
			<Route path="/sms" element={<Dashboard />} />
			<Route path="/notifications" element={<Notice />} />
			<Route path="/faq" element={<Dashboard />} />
			<Route path="/inquiries" element={<Dashboard />} />
			<Route path="/settings" element={<Dashboard />} />
		</Routes>
	);
}

export default App;
