import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

// Read package.json to get version
const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION: packageJson.version || "0.1.0",
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
};

export default nextConfig;
