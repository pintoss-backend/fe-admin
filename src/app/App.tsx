import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm/LoginForm';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Notice } from '@/pages/Notice';
import { NewFaq } from '@/pages/NewFaq';
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
			<Route path="/users" element={<Users />} />
			<Route path="/payments" element={<Dashboard />} />
			<Route path="/sms" element={<Dashboard />} />
			<Route path="/notifications" element={<Notice />} />
			<Route path="/faq" element={<NewFaq />} />
			<Route path="/inquiries" element={<Dashboard />} />
			<Route path="/settings" element={<Dashboard />} />
		</Routes>
	);
}

export default App;
