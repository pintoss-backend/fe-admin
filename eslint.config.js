import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
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
		rules: {
			// React 17+ 에서는 JSX 변환이 자동으로 처리되므로 불필요한 React import 제거
			'react/react-in-jsx-scope': 'off',
			// TypeScript를 사용하므로 PropTypes 검사 비활성화
			'react/prop-types': 'off',
		},
		settings: {
			// React 버전을 자동으로 감지하여 적절한 규칙 적용
			react: { version: 'detect' },
		},
	},
]);
