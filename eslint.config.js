import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			prettier,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			react,
		},
		rules: {
			// React 17+ 에서는 JSX 변환이 자동으로 처리되므로 불필요한 React import 제거
			'react/react-in-jsx-scope': 'off',
			// TypeScript를 사용하므로 PropTypes 검사 비활성화
			'react/prop-types': 'off',
			// TypeScript에서 함수 매개변수는 사용되지 않아도 허용
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			// 기존 no-unused-vars는 비활성화 (TypeScript 규칙 사용)
			'no-unused-vars': 'off',
			// console 사용 제한 (개발 환경에서는 경고)
			'no-console': 'warn',
		},
		settings: {
			// React 버전을 자동으로 감지하여 적절한 규칙 적용
			react: { version: 'detect' },
		},
	},
	// CLI 스크립트는 console 사용 허용
	{
		files: ['**/scripts/**/*.{ts,js}'],
		rules: {
			'no-console': 'off',
		},
	},
]);
