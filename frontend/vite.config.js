/* eslint-disable no-undef */
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	// https://vitejs.dev/config/
	return defineConfig({
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				'/api': {
					target: process.env.VITE_API_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	});
};
