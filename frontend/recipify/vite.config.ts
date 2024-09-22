import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // watch: {
    // During development, Vite will watch the file system to update the browser when the file changes. This option allows you to configure the behavior of the file system watcher. If using WSL, it is recommended to use WSL2 applications to edit files in the WSL file system. It is also possible to use polling mode to watch files, but it is not recommended because it leads to high CPU usage.
    // https://vitejs.dev/config/server-options.html#server-watch
    // usePolling: true,
    // },
    port: 3000,
  },
});
