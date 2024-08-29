import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite'

const cherryPickedKeys = [
  "VERSION",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {};
  cherryPickedKeys.forEach(key => processEnv[key] = env[key]);
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
  }
})


