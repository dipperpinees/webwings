import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

const { API_URL, GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_REDIRECT_URL, MAIN_DOMAIN, WS_URI, GOOGLE_CLIENT_ID } =
    dotenv.config({ path: "./.env" }).parsed;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    define: {
        "process.env.API_URL": JSON.stringify("/api"),
        "process.env.GITHUB_OAUTH_CLIENT_ID": JSON.stringify(GITHUB_OAUTH_CLIENT_ID),
        "process.env.GITHUB_OAUTH_REDIRECT_URL": JSON.stringify(GITHUB_OAUTH_REDIRECT_URL),
        "process.env.PUBLIC_DOMAIN": JSON.stringify(MAIN_DOMAIN),
        "process.env.WS_URI": JSON.stringify(WS_URI),
        "process.env.GOOGLE_CLIENT_ID": JSON.stringify(GOOGLE_CLIENT_ID),
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
