import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import szeneHandler from "./api/szene.js";

function apiDevMiddleware() {
  return {
    name: "nachtschicht-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/szene", (req, res) => {
        szeneHandler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
});
