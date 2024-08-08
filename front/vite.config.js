import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import {nodePolyfills} from "vite-plugin-node-polyfills";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            react(),
            tsconfigPaths(),
            nodePolyfills({include: ["stream", "util"]}),
        ],
        server: {
            port: 3000,
        },
        define: {
            "process.env": env,
        },
        build: {manifest: true},
        base: env.mode === "production" ? "/static/" : "/",
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: "setupTests.js",
        },
    };
});
