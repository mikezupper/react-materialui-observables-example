import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';

    return {
        plugins: [react()],
        define: {
            // Replace global constants in your code
            __DEV__: !isProduction,
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ['react', 'react-dom'],
                        mui: [
                            '@mui/material',
                            '@mui/icons-material',
                            '@mui/x-data-grid',
                            '@emotion/react',
                            '@emotion/styled',
                        ],
                    },
                },
            },
            target: 'esnext',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: isProduction, // Remove console logs in production
                    drop_debugger: isProduction, // Remove debugger statements in production
                },
                mangle: true,
            },
        },
    };
});
