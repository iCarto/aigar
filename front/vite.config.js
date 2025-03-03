/// <reference types="vitest" />
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
            nodePolyfills({
                include: ["stream", "util", "buffer", "vm"],
                globals: {
                    Buffer: true, // can also be 'build', 'dev', or false
                    global: true,
                    process: true,
                },
                protocolImports: true,
            }),
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
