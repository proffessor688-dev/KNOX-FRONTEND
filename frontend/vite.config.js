import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // REMOVED 'host: true' to restrict access to localhost only
    host: "localhost",         // Default is 'localhost', ensuring local-only access
    port: 5173, 

    proxy: {
      "/api": {
        target: "https://knox-backend-2.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});