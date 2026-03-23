import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Ugarit-Exchange-",
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
