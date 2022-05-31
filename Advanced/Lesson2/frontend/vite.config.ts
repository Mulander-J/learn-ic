import { defineConfig, loadEnv } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import inject from '@rollup/plugin-inject'
import { resolve } from "path"
import dfxJson from "./../dfx.json"

const DFX_PORT = dfxJson.networks.local.bind.split(":")[1]
const MAINNET_URL = dfxJson.networks.ic.providers[0]

// See guide on how to configure Vite at:
// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  console.log(`DFX_NETWORK:${process.env["VITE_APP_DFX_NETWORK"]}`)
  const isDev = process.env["VITE_APP_DFX_NETWORK"] !== "ic"
  return defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@img':resolve(__dirname, './src/assets/img'),
    },
  },
  server: {
    fs: {
      allow: ["."],
    },
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      "/api": {
        target: isDev ? `http://localhost:${DFX_PORT}` : MAINNET_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  build:{
    minify: 'terser',
      terserOptions: {
        compress: {
          //  drop console at env.prod
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
  },
})
}
