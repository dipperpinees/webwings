import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

const { API_URL, GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_REDIRECT_URL, PUBLIC_DOMAIN } = dotenv.config({ path: "./.env" }).parsed;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    define: {
        "process.env.API_URL": JSON.stringify("/api"),
        "process.env.GITHUB_OAUTH_CLIENT_ID": JSON.stringify(GITHUB_OAUTH_CLIENT_ID),
        "process.env.GITHUB_OAUTH_REDIRECT_URL": JSON.stringify(GITHUB_OAUTH_REDIRECT_URL),
        "process.env.PUBLIC_DOMAIN": JSON.stringify(PUBLIC_DOMAIN),
    },
    server: {
        proxy: {
            "/api": {
                target: API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
                secure: false,
                ws: true,
            },
        },
    },
});
