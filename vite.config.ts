import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), vanillaExtractPlugin()],
	build: {
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css.ts'],
	},
});
