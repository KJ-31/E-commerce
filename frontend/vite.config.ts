import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 컨테이너 외부 접속 허용
    port: 5173,
    strictPort: true,
    // 백엔드 프록시가 필요하면 주석 해제:
    // proxy: {
    //   "/api": {
    //     target: "http://backend:3001",
    //     changeOrigin: true,
    //     rewrite: (p) => p.replace(/^\/api/, ""),
    //   },
    // },
  },
  preview: {
    host: true,
    port: 5173,
  },
});