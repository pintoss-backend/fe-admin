import { create } from 'zustand';
import type { AuthState, User } from '../model';

interface AuthStore extends AuthState {
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,

	login: async (email: string, password: string) => {
		set({ isLoading: true });

		try {
			// 실제 API 호출 대신 시뮬레이션 (개발 환경에서는 빠르게)
			await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms

			// 테스트 계정 검증
			if (email === 'admin@example.com' && password === 'password123') {
				// 임시 사용자 데이터
				const user: User = {
					id: '1',
					email,
					name: '관리자',
				};

				set({
					user,
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
			}
		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},

	logout: () => {
		set({
			user: null,
			isAuthenticated: false,
			isLoading: false,
		});
	},

	setUser: (user: User) => {
		set({
			user,
			isAuthenticated: true,
		});
	},
}));
