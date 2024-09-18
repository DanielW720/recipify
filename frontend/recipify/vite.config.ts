import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // https://vitejs.dev/config/server-options.html#server-watch
    },
    port: 3000,
  },
});
