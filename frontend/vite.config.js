import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        headers: {
            "Content-Security-Policy":
                [
                    "default-src 'self';",
                    "script-src 'self';",
                    "style-src 'self';",
                    "img-src 'self' data:;",
                    "object-src 'none';",
                    "base-uri 'self';",
                    "form-action 'self';",
                    "frame-ancestors 'none';"
                ].join(" "),
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff"
        },
        proxy: {
            '/api': 'http://localhost:5000',
        },
    },
});
