import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite';
var cherryPickedKeys = [
    "VERSION",
];
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var processEnv = {};
    cherryPickedKeys.forEach(function (key) { return processEnv[key] = env[key]; });
    return {
        define: {
            'process.env': env
        },
        plugins: [react(),
            checker({
                typescript: false,
            }),],
        resolve: {
            alias: [{ find: '@', replacement: '/src' }],
        },
    };
});
