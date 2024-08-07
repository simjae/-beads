import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { defaultLoaders }) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@styles": path.resolve("./src/styles"),
    };
    return config;
  },
};

export default nextConfig;
