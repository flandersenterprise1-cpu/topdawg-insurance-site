import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const preview = env.VITE_PREVIEW === "1";
  return {
    base: "/",
    plugins: [react()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      outDir: preview ? "dist-preview" : "dist",
      emptyOutDir: true,
      // The clickable preview is a single self-contained file, so inline images and chunks.
      assetsInlineLimit: preview ? 10_000_000 : 4096,
      rollupOptions: preview ? { output: { inlineDynamicImports: true } } : {},
    },
  };
});
