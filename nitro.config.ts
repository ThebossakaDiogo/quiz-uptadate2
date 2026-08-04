import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  handlers: [
    {
      route: "/**",
      handler: "./dist/server/server.js",
    },
  ],
  publicAssets: [
    {
      dir: "./dist/client",
      maxAge: 31536000,
    },
  ],
});
