import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Dashboard } from '@/pages/Dashboard';
import { useAuthStore } from '@/entities/auth/store/authStore';

function App() {
	const { isAuthenticated } = useAuthStore();

	return isAuthenticated ? <Dashboard /> : <LoginForm />;
}

export default App;
